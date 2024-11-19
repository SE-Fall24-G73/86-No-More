import React from 'react';

const ProductTypeSelector = ({ selectedProductTypes, onSelectProductType }) => {
  const productTypes = ['Beef', 'Pork', 'Chicken', 'Milk', 'Egg', 'Vegan', 'Vegetarian', 'Glutten-Free'];

  const handleProductTypeToggle = (productType) => {
    const updatedSelection = selectedProductTypes.includes(productType)
      ? selectedProductTypes.filter((type) => type !== productType)
      : [...selectedProductTypes, productType];

    onSelectProductType(updatedSelection);
  };

  return (
    <div>
      {productTypes.map((productType) => (
        <label key={productType}>
          <input
            type="checkbox"
            value={productType}
            checked={selectedProductTypes.includes(productType)}
            onChange={() => handleProductTypeToggle(productType)}
          />
          {productType}
        </label>
      ))}
    </div>
  );
};

export default ProductTypeSelector;
