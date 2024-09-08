import React from "react";
import styled from "styled-components";
import centsToUSD from "../helpers/centsToUSD";

const ProductBoxContainer = styled.div`
  width: 100%;
  height: 203px;
  background-color: #ffffff;
  padding: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;

  &:nth-child(2n + 1) {
    border-radius: 12px 32px 12px 12px;
  }

  &:nth-child(2n) {
    border-radius: 32px 12px 12px 12px;
  }
`;

const TextProductBox = styled.div`
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;
  color: #323232;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 122px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 12px 0;
`;

const AddToCartButton = styled.div`
  background-color: ${(props) => (props.disabled ? "#cccccc" : "orange")};
  color: ${(props) => (props.disabled ? "#666666" : "white")};
  border-radius: 8px 0;
  width: 40px;
  height: 40px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  position: absolute;
  bottom: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const ProductBox = ({
  product,
  productsCart,
  selectedSKUs,
  handleSelectProduct,
  handleAddToCartClick,
}) => {
  return (
    <ProductBoxContainer
      key={product.id}
      onClick={() => handleSelectProduct(product.id, product.brand)}
    >
      <TextProductBox>{product.brand}</TextProductBox>
      <ImageContainer>
        <img
          src={`${process.env.PUBLIC_URL}${product.image.replace(/\.[^/.]+$/, "")}.png`}
          alt={product.brand}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </ImageContainer>
      <div style={{ display: "flex", marginTop: "auto" }}>
        <TextProductBox>
          ${centsToUSD(selectedSKUs[product.id].price)}
        </TextProductBox>
        <AddToCartButton
          onClick={(e) => handleAddToCartClick(e, product)}
          disabled={!!productsCart.find((pc) => pc.id === product.id)}
        >
          +
        </AddToCartButton>
      </div>
    </ProductBoxContainer>
  );
};

export default ProductBox;
