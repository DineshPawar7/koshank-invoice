import React from "react";

const InvoiceField = ({ onEditItem, cellData }) => {
  return (
    <input
      type={cellData.type}
      name={cellData.name}
      placeholder={cellData.placeholder}
      min={cellData.min || undefined}
      value={cellData.value}
      data-id={cellData.id}
      onChange={onEditItem}
      className="w-full border rounded px-2 py-1 text-center"
    />
  );
};

export default InvoiceField;
