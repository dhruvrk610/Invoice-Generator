// InvoiceGenerator.js
import React, { useState, useRef } from 'react';
import './App.css';
import html2pdf from 'html2pdf.js';
import Header from './components/Header';
import ItemSelection from './components/ItemSelection';
import InvoiceTable from './components/InvoiceTable';
import InvoiceTotal from './components/InvoiceTotal';


const defaultItems = [
  { name: 'PavBhaji-Full', price: 60 },
  { name: 'PavBhaji-Half', price: 40 },
  { name: 'Pulav-Full', price: 70 },
  { name: 'Pulav-Half', price: 40 },
  { name: 'Extra Pav', price: 5 },
  { name: 'Chhash', price: 20 },
];

const gstRate = 18;
const cgstRate = 9;
const sgstRate = 9;

const InvoiceGenerator = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(1);


  const addItem = () => {
    if (itemName && price) {
      const existingItem = items.find((item) => item.itemName === itemName);

      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: Number(existingItem.quantity) + Number(quantity),
        };

        const updatedItems = items.map((item) =>
          item.itemName === itemName ? updatedItem : item
        );

        setItems(updatedItems);
      } else {
        setItems([...items, { itemName, quantity, price }]);
      }

      setItemName('');
      setQuantity(1);
      setPrice('');
    }
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((item, i) => i !== index);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const totalAmount = calculateTotal();
  const gstAmount = (totalAmount * gstRate) / 100;
  const cgstAmount = (totalAmount * cgstRate) / 100;
  const sgstAmount = (totalAmount * sgstRate) / 100;
  const grandTotal = totalAmount + gstAmount + cgstAmount + sgstAmount;

  const formattedTotalAmount = totalAmount.toFixed(2).toLocaleString();
  const formattedGstAmount = gstAmount.toFixed(2).toLocaleString();
  const formattedCgstAmount = cgstAmount.toFixed(2).toLocaleString();
  const formattedSgstAmount = sgstAmount.toFixed(2).toLocaleString();
  const formattedGrandTotal = grandTotal.toFixed(2).toLocaleString();

  const handleItemChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      const selectedItem = defaultItems.find((item) => item.name === selectedValue);
      if (selectedItem) {
        setItemName(selectedItem.name);
        setPrice(selectedItem.price);
        setQuantity(1); // Reset quantity when a new item is selected
      } else {
        setItemName('');
        setPrice('');
      }
    } else {
      setItemName('');
      setPrice('');
    }
  };


  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so we add 1.
    const year = today.getFullYear();
    return <b>{day}-{month}-{year}</b>;
  };

  const currentDate = getCurrentDate();

  const pdfRef = useRef(null);


  const handleDownload = () => {
    // Increment the invoiceNumber by 1 before generating the PDF
    setInvoiceNumber((prevInvoiceNumber) => prevInvoiceNumber + 1);

    // Clear the input fields
    setItemName('');
    setQuantity(1);
    setPrice('');

    // Clear the items state (empty the invoice)
    setItems([]);

    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so we add 1.
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const opt = {
      margin: 0,
      filename: `invoice#${invoiceNumber}_(${formattedDate}).pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'junior-legal', orientation: 'portrait', precision: '2' },
    };

    // Select the container element with the class 'invoice-generator'
    const container = document.querySelector('.invoice-generator');

    // Clone the container element to remove the buttons and other components
    const printableContainer = container.cloneNode(true);

    // Remove buttons from the cloned container
    const buttons = printableContainer.querySelectorAll('button');
    buttons.forEach((button) => button.remove());

    // Remove other components with the class "mb-3" from the cloned container
    const componentsToRemove = printableContainer.querySelectorAll('.mb-3');
    componentsToRemove.forEach((component) => component.remove());

    // Add the 'printable' class to the cloned container element
    printableContainer.classList.add('printable');

    // Remove the "Remove" column from the table in the cloned container
    const table = printableContainer.querySelector('table');
    const removeColumnIndex = 4; // Adjust this index based on the column position in your table
    const tableRows = table.querySelectorAll('tr');
    tableRows.forEach((row) => {
      row.deleteCell(removeColumnIndex);
    });

    const thankYouText = document.createElement('p');
    thankYouText.style.textAlign = 'center'; // Apply the text-align: center style

    // Add the "Thank you!" text in a separate span element
    const thankYouSpan = document.createElement('span');
    thankYouSpan.textContent = 'Thank you! Visit Again! ';

    // Add the smiley emoji in a separate span element with a larger font size
    const smileySpan = document.createElement('span');
    smileySpan.textContent = '\u263A'; // Add the Unicode character for the smiley emoji
    smileySpan.style.fontSize = '20px'; // Increase the font size for the smiley emoji

    // Append the smileySpan and thankYouSpan to the thankYouText
    thankYouText.appendChild(thankYouSpan);
    thankYouText.appendChild(smileySpan);

    // Append the thankYouText to the printableContainer
    printableContainer.appendChild(thankYouText);


    html2pdf()
      .from(printableContainer)
      .set(opt)
      .save();
  };

  const handlePrint = () => {
    window.print();
  };


  return (
    <>
      <div className="center-container">
        <div className="invoice-generator" ref={pdfRef}>
          <Header />
          <div className='dateNum container my-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p><i>Date:</i><u>{currentDate}</u></p>
            </div>
            <div>
              <p><i>#Invoice Number:</i><b>{invoiceNumber}</b></p>
            </div>
          </div>
          <hr />
          <ItemSelection
            defaultItems={defaultItems}
            itemName={itemName}
            quantity={quantity}
            price={price}
            handleItemChange={handleItemChange}
            setQuantity={setQuantity}
            setPrice={setPrice}
            addItem={addItem}
          />
          <InvoiceTable items={items} removeItem={removeItem} />
          <InvoiceTotal
            formattedTotalAmount={formattedTotalAmount}
            formattedGstAmount={formattedGstAmount}
            formattedCgstAmount={formattedCgstAmount}
            formattedSgstAmount={formattedSgstAmount}
            formattedGrandTotal={formattedGrandTotal}
          />
          <hr />
          <div className='my-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type='button' className='btn btn-primary' onClick={handleDownload}>Download</button>
            <button type='button' className='btn btn-outline-info' onClick={handlePrint}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>

            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceGenerator;


