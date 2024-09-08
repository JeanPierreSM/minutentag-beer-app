/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { ArrowLeft, MoreHorizontal, ShoppingBag } from "react-feather";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Spinner from "../components/Spinner";
import Pill from "../components/Pill";
import centsToUSD from "../helpers/centsToUSD";

const MainContainer = styled.div`
  width: 100%;
  max-width: 375px;
  height: 100vh;
  margin: 30px auto 0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  overflow-y: auto;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const DetailText = styled.p`
  font-family: "DM Sans", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 23.44px;
  text-align: center;
  flex: 1;
`;

const ProductImage = styled.div`
  width: 100%;
  height: 25vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;

  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
`;

const DetailsContainer = styled.div`
  background-color: #ffffff;
  border-radius: 48px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const NamePriceRow = styled.h2`
  display: flex;
  justify-content: space-between;
  height: 30px;
  margin-bottom: 10px;
`;

const ProductName = styled.h2`
  font-family: "DM Sans", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 31.25px;
`;

const ProductPrice = styled.h2`
  font-family: "DM Sans", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 31.25px;
  color: #ff9f24;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OriginStockText = styled.p`
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.23px;
  color: #969696;
`;

const DescriptionTitle = styled.p`
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 20.83px;
`;

const DescriptionText = styled.p`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.showFull ? "none" : "4")};
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: normal;
  max-height: ${(props) =>
    props.showFull ? "none" : "6rem"}; // Adjust to limit height when collapsed
  color: #969696;
`;

const ReadMore = styled.span`
  color: #ff9f24;
  cursor: pointer;
  font-weight: bold;
`;

const SizeTitle = styled.p`
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 20.83px;
  margin-top: 30px;
`;

const SizePills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 24px;
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  margin-top: auto; //NEW
`;

const ShoppingBagButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border: 2px solid #ff9f24;
  border-radius: 8px;
  background-color: #ffffff;
  cursor: pointer;

  svg {
    color: #ff9f24;
  }
`;

const AddToCartButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#cccccc" : "#ff9f24")};
  color: ${(props) => (props.disabled ? "#666666" : "white")};
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 16px;
  width: 70%;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const LONG_POLLING_INTERVAL = 15000;

const ProductDetailsPage = ({
  loadingFullData,
  selectedSKUs,
  handleSKUSelect,
  handleAddToCartClick,
  productsCart,
}) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get("productId");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const currentStock = selectedSKUs[selectedProduct?.id]?.stock;
  const currentPrice = selectedSKUs[selectedProduct?.id]?.price;

  const handleReadMoreClick = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleGoBack = () => {
    localStorage.removeItem("selectedProduct");
    navigate(`/products`);
  };

  const handle3DotsMenuClicked = () => {
    window.alert("3dots Menu: Work in progress!");
  };

  const handleShoppingIconClicked = (e) => {
    e.stopPropagation();
    window.alert(
      "Shopping icon button: not sure what this button should do, but its definitely a work in progress!",
    );
  };

  const handleSKUSelectClick = (productId, skuCode) => {
    axios
      .get(`${apiBaseUrl}/api/stock-price/${skuCode}`)
      .then((response) => {
        handleSKUSelect(productId, response.data, skuCode);
      })
      .catch((error) => {
        window.alert(
          `Unexpected error while fetching SKU data. Please, contact your administrator.\n\nError: ${error}`,
        );
      });
  };

  useEffect(() => {
    const storedProduct = localStorage.getItem("selectedProduct");
    if (storedProduct) {
      setSelectedProduct(JSON.parse(storedProduct));
    } else {
      navigate(`/products`);
    }
  }, [productId, navigate]);

  useEffect(() => {
    const longPollingStockPrices = () => {
      selectedProduct.skus.forEach((sku) => {
        axios
          .get(`${apiBaseUrl}/api/stock-price/${sku.code}`)
          .then((response) => {
            if (
              selectedSKUs[selectedProduct?.id]?.code === sku.code &&
              (currentStock !== response.data.stock ||
                currentPrice !== response.data.price)
            ) {
              handleSKUSelect(productId, response.data, sku.code);
            }
          })
          .catch((error) => {
            window.alert(
              `Unexpected error while fetching SKU data. Please, contact your administrator.\n\nError: ${error}`,
            );
          });
      });
    };

    const intervalId = setInterval(
      longPollingStockPrices,
      LONG_POLLING_INTERVAL,
    );

    return () => clearInterval(intervalId);
  }, [selectedProduct, currentStock, currentPrice]);

  return (
    <MainContainer>
      <TopBar>
        <IconWrapper onClick={handleGoBack}>
          <ArrowLeft size={24} />
        </IconWrapper>
        <DetailText>Detail</DetailText>
        <IconWrapper onClick={handle3DotsMenuClicked}>
          <MoreHorizontal size={24} />
        </IconWrapper>
      </TopBar>
      {loadingFullData ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <ProductImage>
            <img
              src={`${process.env.PUBLIC_URL}${selectedProduct?.image.replace(/\.[^/.]+$/, "")}.png`}
              alt={selectedProduct?.brand}
            />
          </ProductImage>
          <DetailsContainer>
            <NamePriceRow>
              <ProductName>{selectedProduct?.brand}</ProductName>
              <ProductPrice>${centsToUSD(currentPrice)}</ProductPrice>
            </NamePriceRow>
            <InfoRow>
              <OriginStockText>
                {`Origin: ${selectedProduct?.origin} | Stock: ${currentStock}`}
              </OriginStockText>
            </InfoRow>
            <div style={{ overflowY: "auto" }}>
              <DescriptionTitle>Description</DescriptionTitle>
              <DescriptionText showFull={showFullDescription}>
                {selectedProduct?.information} Read
              </DescriptionText>
              {!showFullDescription && (
                <ReadMore onClick={handleReadMoreClick}>Read more</ReadMore>
              )}
            </div>
            <SizeTitle>Size</SizeTitle>
            <SizePills>
              {(selectedProduct?.skus || []).map((sku) => (
                <Pill
                  sku={sku}
                  selectedProduct={selectedProduct}
                  selectedSKUs={selectedSKUs}
                  handleSKUSelectClick={handleSKUSelectClick}
                />
              ))}
            </SizePills>
            <BottomBar>
              <ShoppingBagButton>
                <ShoppingBag
                  size={24}
                  onClick={(e) => handleShoppingIconClicked(e)}
                />
              </ShoppingBagButton>
              <AddToCartButton
                onClick={(e) => handleAddToCartClick(e, selectedProduct)}
                disabled={
                  !!productsCart.find((pc) => pc.id === selectedProduct?.id)
                }
              >
                Add to Cart
              </AddToCartButton>
            </BottomBar>
          </DetailsContainer>
        </React.Fragment>
      )}
    </MainContainer>
  );
};

export default ProductDetailsPage;
