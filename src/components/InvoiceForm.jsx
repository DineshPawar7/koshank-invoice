import React, { useState } from "react";
import { uid } from "uid";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";

const date = new Date();
const today = date.toLocaleDateString("en-GB", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [cashierName, setCashierName] = useState("");
  const [customerAddress, setcustomerAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [items, setItems] = useState([
    {
      id: uid(6),
      name: "",
      quantity: "0",
      cost: "0",
      advance: "0",
    },
  ]);

  const reviewInvoiceHandler = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const addItemHandler = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: uid(6),
        name: "",
        quantity: "0",
        cost: "0",
        advance: "0",
      },
    ]);
  };

  const deleteItemHandler = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const editItemHandler = (event) => {
    const { id, name, value } = event.target;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      )
    );
  };

  // Calculate totals
  // Ensure all values are converted to numbers
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
  const totalCost = items.reduce(
    (sum, item) => sum + (Number(item.cost) * Number(item.quantity) || 0),
    0
  );

  const totalAdvance = items.reduce(
    (sum, item) => sum + (Number(item.advance) || 0),
    0
  );

  // Calculate remaining payment correctly
  const remainingPayment = (totalCost || 0) - (totalAdvance || 0);

  return (
    <form
      className="relative flex flex-col px-2 md:flex-row"
      onSubmit={reviewInvoiceHandler}
    >
      <div className="my-6 flex-1 space-y-2 rounded-md bg-white p-4 shadow-sm md:p-6">
        <div className="flex justify-between border-b pb-4">
          <div className="flex space-x-2">
            <span className="font-bold">Date: </span>
            <input
              required
              className="max-w-[130px]"
              type="date"
              name="invoiceDate"
              id="invoiceDate"
              value={invoiceDate}
              onChange={(event) => setInvoiceDate(event.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-bold" htmlFor="invoiceNumber">
              Invoice No:
            </label>
            <input
              required
              className="max-w-[130px]"
              type="number"
              name="invoiceNumber"
              id="invoiceNumber"
              min="1"
              step="1"
              value={invoiceNumber}
              onChange={(event) => setInvoiceNumber(event.target.value)}
            />
          </div>
        </div>

        <h1 className="text-center text-lg font-bold">INVOICE</h1>

        <div className="grid grid-cols-2 gap-2 pb-8 pt-4">
          <label htmlFor="cashierName" className="text-sm font-bold">
            Client:
          </label>
          <input
            required
            className="flex-1"
            placeholder="Client name"
            type="text"
            name="cashierName"
            id="cashierName"
            value={cashierName}
            onChange={(event) => setCashierName(event.target.value)}
          />
          <label htmlFor="customerAddress" className="text-sm font-bold">
            Address:
          </label>
          <input
            required
            className="flex-1"
            placeholder="Address"
            type="text"
            name="customerAddress"
            id="customerAddress"
            value={customerAddress}
            onChange={(event) => setcustomerAddress(event.target.value)}
          />
        </div>

        <table className="w-full p-4 text-left">
          <thead>
            <tr className="border-b text-sm">
              <th>ITEM</th>
              <th className="text-center">QTY</th>
              <th className="text-center">COST</th>
              <th className="text-center">ADVANCE</th>
              <th className="text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <InvoiceItem
                key={item.id}
                id={item.id}
                name={item.name}
                quantity={item.quantity}
                cost={item.cost}
                advance={item.advance}
                onDeleteItem={deleteItemHandler}
                onEditItem={editItemHandler}
              />
            ))}
          </tbody>
        </table>

        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          type="button"
          onClick={addItemHandler}
        >
          Add Item
        </button>

        {/* Total Calculation Section */}
        <div className="mt-4 flex justify-between border-t pt-2">
          <span className="font-bold">Total QNTY:</span>
          <span className="font-bold">{totalCost}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Total Cost:</span>
          <span className="font-bold">₹{totalQuantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Total Advance:</span>
          <span className="font-bold">₹{totalAdvance}</span>
        </div>
      </div>

      {/* Review Invoice Button and Modal */}
      <div className="basis-1/4 bg-transparent">
        <div className="sticky top-0 space-y-4 pb-8 md:pl-4">
          <button
            className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
            type="submit"
          >
            Review Invoice
          </button>

          <InvoiceModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            invoiceInfo={{
              invoiceDate,
              today,
              cashierName,
              customerAddress,
              remainingPayment,
            }}
            items={items}
          />
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
