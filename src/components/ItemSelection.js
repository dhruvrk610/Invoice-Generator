// ItemSelection.js
import React from 'react';

const ItemSelection = ({ defaultItems, itemName, quantity, price, handleItemChange, setQuantity, setPrice, addItem }) => {
  return (
    <div className="mb-3">
      <div className="mb-3">
        <h3>Item Name:</h3>
        <select value={itemName} onChange={handleItemChange} className="form-select" style={{fontFamily:'Victor Mono'}}>
          <option value="" disabled>Select an item</option>
          {defaultItems.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <h3>Quantity:</h3>
        <input type="number" className='form-control' value={quantity} style={{fontFamily:'Victor Mono'}} onChange={(e) => setQuantity(e.target.value)} />
      </div>
      <div className="mb-3">
        <h3>Price:</h3>
        <input className='form-control' type="number" value={price} style={{fontFamily:'Victor Mono'}} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <button type='button' className='btn btn-primary' onClick={addItem}>Add Item</button>
    </div>
  );
};

export default ItemSelection;
