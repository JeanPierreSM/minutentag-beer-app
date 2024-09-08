import React from "react";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Spinner = () => {
  return (
    <SpinnerContainer>
      <ClipLoader color="#ff9f24" loading={true} size={50} />
    </SpinnerContainer>
  );
};

export default Spinner;
