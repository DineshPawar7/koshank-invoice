import React, { useState } from "react";
import { uid } from "uid";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import incrementString from "../helpers/incrementString";

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
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([
    {
      id: uid(6),
      name: "",
      pending: "0",
      received: "0",
    },
  ]);

  const reviewInvoiceHandler = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const addNextInvoiceHandler = () => {
    setInvoiceNumber((prevNumber) => incrementString(prevNumber));
    setItems([
      {
        id: uid(6),
        name: "",
        pending: "0",
        received: "0",
      },
    ]);
  };

  const addItemHandler = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: uid(6),
        name: "",
        pending: "0",
        received: "0",
      },
    ]);
  };

  const deleteItemHandler = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const editItemHandler = (event) => {
    const { id, name, value } = event.target;
    const newItems = items.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setItems(newItems);
  };

  const totalPending = items.reduce(
    (sum, item) => sum + Number(item.pending),
    0
  );
  const totalReceived = items.reduce(
    (sum, item) => sum + Number(item.received),
    0
  );
  const total = totalPending + totalReceived;

  return (
    <form
      className="relative flex flex-col px-2 md:flex-row"
      onSubmit={reviewInvoiceHandler}
    >
      <div className="my-6 flex-1 space-y-2 rounded-md bg-white p-4 shadow-sm md:p-6">
        <div className="flex justify-between border-b pb-4">
          <div className="flex space-x-2">
            <span className="font-bold">Date: </span>
            <span>{today}</span>
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
        <div className="grid grid-cols-2 gap-2 pt-4 pb-8">
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
          <label htmlFor="customerName" className="text-sm font-bold">
            Address:
          </label>
          <input
            required
            className="flex-1"
            placeholder="Address"
            type="text"
            name="customerName"
            id="customerName"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />
        </div>
        <table className="w-full p-4 text-left">
          <thead>
            <tr className="border-b text-sm">
              <th>ITEM</th>
              <th className="text-center">PENDING</th>
              <th className="text-center">RECEIVED</th>
              <th className="text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <InvoiceItem
                key={item.id}
                id={item.id}
                name={item.name}
                pending={item.pending}
                received={item.received}
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
        <div className="mt-4 flex justify-between border-t pt-2">
          <span className="font-bold">Total Pending:</span>
          <span className="font-bold">₹{totalPending}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Total Received:</span>
          <span className="font-bold">₹{totalReceived}</span>
        </div>
        <div className="mt-4 flex justify-between border-t pt-2">
          <span className="font-bold">Total:</span>
          <span className="font-bold">₹{total}</span>
        </div>
      </div>
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
              today,
              cashierName,
              customerName,
              totalPending,
              totalReceived,
              total,
            }}
            items={items}
            onAddNextInvoice={addNextInvoiceHandler}
          />
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
