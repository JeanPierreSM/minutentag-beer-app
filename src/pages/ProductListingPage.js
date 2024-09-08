import React from "react";
import styled from "styled-components";
import { Menu } from "react-feather";
import { useNavigate } from "react-router-dom";
import ProductBox from "../components/ProductBox";
import Spinner from "../components/Spinner";

const MainContainer = styled.div`
  width: 100%;
  max-width: 375px;
  height: 100vh;
  margin: 30px auto 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfilePic = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const HiText = styled.div`
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 20.83px;
  color: #646464;
  opacity: 0.6;
`;

const WelcomeBackText = styled.div`
  font-family: "DM Sans", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 31.25px;
  color: #323232;
  margin-bottom: 20px;
`;

const OurProductsText = styled.div`
  font-family: "DM Sans", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 23.44px;
  margin-bottom: 10px;
`;

const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProductListingPage = ({
  products,
  selectedSKUs,
  loadingFullData,
  handleAddToCartClick,
  productsCart,
}) => {
  const navigate = useNavigate();

  const handleSelectProduct = (productId, productBrand) => {
    const formattedBrand = encodeURIComponent(productBrand);
    const selected = products.find(
      (p) => p.id === productId && p.brand === productBrand,
    );
    localStorage.setItem("selectedProduct", JSON.stringify(selected));
    navigate(`/product?productId=${productId}&productBrand=${formattedBrand}`);
  };

  const handleHamburgerMenuClick = () => {
    window.alert("Hamburger Menu: Work in progress!");
  };

  return (
    <MainContainer>
      <Header>
        <Menu size={24} onClick={handleHamburgerMenuClick} />
        <ProfilePic src={process.env.PUBLIC_URL + "/icons/pfp.jpg"} alt="pfp" />
      </Header>
      <HiText>Hi Mr. Michael,</HiText>
      <WelcomeBackText>Welcome Back!</WelcomeBackText>
      <OurProductsText>Our Products</OurProductsText>
      <ProductsContainer>
        {loadingFullData ? (
          <Spinner />
        ) : (
          (products || []).map((product) => (
            <ProductBox
              product={product}
              productsCart={productsCart}
              selectedSKUs={selectedSKUs}
              handleSelectProduct={handleSelectProduct}
              handleAddToCartClick={handleAddToCartClick}
            />
          ))
        )}
      </ProductsContainer>
    </MainContainer>
  );
};

export default ProductListingPage;
