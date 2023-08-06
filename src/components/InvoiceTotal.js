// InvoiceTotal.js
import React from 'react';

const InvoiceTotal = ({ formattedTotalAmount, formattedGstAmount, formattedCgstAmount, formattedSgstAmount, formattedGrandTotal }) => {
  return (
    <div className="total-container">
      <div>
        <strong>Total Amount: {formattedTotalAmount}/-</strong>
      </div>
      <div>
        <strong>GST (18%): {formattedGstAmount}/-</strong>
      </div>
      <div>
        <strong>CGST (9%): {formattedCgstAmount}/-</strong>
      </div>
      <div>
        <strong>SGST (9%): {formattedSgstAmount}/-</strong>
      </div>
      <hr />
      <div>
        <strong>Grand Total: {formattedGrandTotal}/-</strong>
      </div>
    </div>
  );
};

export default InvoiceTotal;
