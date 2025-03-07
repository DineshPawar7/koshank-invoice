import React from 'react';
import InvoiceField from './InvoiceField';

const InvoiceItem = ({ id, name, quantity, cost, advance, onDeleteItem, onEditItem }) => {
  const deleteItemHandler = () => {
    onDeleteItem(id);
  };

  return (
    <tr>
      {/* Item Name */}
      <td className="max-w-[100px]">
        <InvoiceField
          onEditItem={(event) => onEditItem(event)}
          cellData={{
            placeholder: 'Product Name',
            type: 'text',
            name: 'name',
            id: id,
            value: name,
          }}
        />
      </td>

      {/* Cost */}
      <td className="max-w-[20px]">
        <InvoiceField
          onEditItem={(event) => onEditItem(event)}
          cellData={{
            placeholder: 'cost',
            type: 'number',
            name: 'cost',
            id: id,
            value: cost,
          }}
        />
      </td>

      {/* Quantity */}
      <td className="max-w-[20px] md:max-w-[20px]">
        <InvoiceField
          onEditItem={(event) => onEditItem(event)}
          cellData={{
            type: 'number',
            placeholder: 'qty',
            min: '1',
            name: 'quantity',
            id: id,
            value: quantity,
          }}
        />
      </td>

      {/* Advance */}
      <td className="max-w-[20px]">
        <InvoiceField
          onEditItem={(event) => onEditItem(event)}
          cellData={{
            placeholder: 'advance',
            type: 'number',
            name: 'advance',
            id: id,
            value: advance,
          }}
        />
      </td>

      {/* Delete Button */}
      <td className="flex items-center justify-center">
        <button
          className="rounded-md bg-red-500 p-2 text-white shadow-sm transition-colors duration-200 hover:bg-red-600"
          onClick={deleteItemHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default InvoiceItem;
