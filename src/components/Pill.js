import React from "react";
import styled from "styled-components";

const PillContainer = styled.div`
  padding: 5px 10px;
  background-color: #ffffff;
  border: 1px;
  border-radius: 15.5px;
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  line-height: 18.23px;
  cursor: pointer;
  color: ${(props) => (props.selected ? "#FF9F24" : "#969696")};
  border: 1px solid ${(props) => (props.selected ? "#FF9F24" : "#969696")};

  &:hover {
    background-color: #ddd;
  }
`;

const Pill = ({ sku, selectedProduct, selectedSKUs, handleSKUSelectClick }) => {
  return (
    <PillContainer
      key={sku.code}
      selected={selectedSKUs[selectedProduct?.id]?.code === sku.code}
      onClick={() => handleSKUSelectClick(selectedProduct?.id, sku.code)}
    >
      {sku.name}
    </PillContainer>
  );
};

export default Pill;
