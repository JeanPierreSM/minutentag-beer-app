import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import axios from "axios";
import centsToUSD from "./helpers/centsToUSD";

const App = () => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const hasFetchedData = useRef(false);
  const [products, setProducts] = useState([]);
  const [productsCart, setProductsCart] = useState([]);
  const [selectedSKUs, setSelectedSKUs] = useState({});
  const [loadingFullData, setLoadingFullData] = useState(false);

  const handleSKUSelect = (productId, stockPriceData, skuCode) => {
    setSelectedSKUs((prevSelectedSKUs) => ({
      ...prevSelectedSKUs,
      [productId]: { ...stockPriceData, code: skuCode },
    }));
  };

  const setInitialSelectedSKUs = (prods, skuData) => {
    // Set first SKU for each product
    const initialSelectedSKUs = {};
    prods.forEach((product) => {
      if (product.skus && product.skus.length > 0) {
        initialSelectedSKUs[product.id] = skuData[product.skus[0].code];
        initialSelectedSKUs[product.id].code = product.skus[0].code;
      }
    });
    setSelectedSKUs(initialSelectedSKUs);
  };

  const handleAddToCartClick = (e, newProduct) => {
    e.stopPropagation();

    const updatedCart = [...productsCart, newProduct];
    setProductsCart(updatedCart);

    let cartMessage = `Product "${newProduct.brand}" added to cart!\nSKU Price: $${centsToUSD(selectedSKUs[newProduct.id].price)}.\n\nYour current cart:\n`;
    let totalPrice = 0;
    updatedCart.forEach((product) => {
      const skuPrice = selectedSKUs[product.id].price;
      totalPrice += skuPrice;
      cartMessage += `\u2022 ${product.brand} | SKU Price: $${centsToUSD(skuPrice)}.-\n`;
    });
    cartMessage += `\nTOTAL: $${centsToUSD(totalPrice)}`;
    window.alert(cartMessage);
  };

  useEffect(() => {
    // Since React.StrictMode invokes lifecycle methods twice during dev to identify side effects, I workaround with this instead of removing StrictMode
    if (hasFetchedData.current) return;

    setLoadingFullData(true);
    Promise.all([
      axios.get(`${apiBaseUrl}/api/products`),
      axios.get(`${apiBaseUrl}/api/stock-price/all`),
    ])
      .then(([productsResponse, stockPriceResponse]) => {
        const productsData = productsResponse.data;
        const stockPriceData = stockPriceResponse.data;

        setProducts(productsData);
        setInitialSelectedSKUs(productsData, stockPriceData);
      })
      .catch((error) => {
        window.alert(
          `Unexpected error while fetching product data. Please, contact your administrator.\n\nError: ${error}`,
        );
      })
      .finally(() => setLoadingFullData(false));
    hasFetchedData.current = true;
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/products"
            element={
              <ProductListingPage
                products={products}
                selectedSKUs={selectedSKUs}
                loadingFullData={loadingFullData}
                handleAddToCartClick={handleAddToCartClick}
                productsCart={productsCart}
              />
            }
          />
          <Route
            path="/product"
            element={
              <ProductDetailsPage
                products={products}
                selectedSKUs={selectedSKUs}
                handleSKUSelect={handleSKUSelect}
                loadingFullData={loadingFullData}
                handleAddToCartClick={handleAddToCartClick}
                productsCart={productsCart}
              />
            }
          />
          <Route path="/" element={<Navigate to="/products" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
