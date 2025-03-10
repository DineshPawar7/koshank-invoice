import React, { useState, useEffect } from "react";
import {
  MdDelete,
  MdEdit,
  MdPushPin,
  MdMenuBook,
  MdClose,
} from "react-icons/md";

const Sidebar = ({ invoices, setInvoices, onEdit }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  // Sidebar toggle function
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Delete invoice function
  const deleteInvoice = (id) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
  };

  const pinInvoice = (id) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, pinned: !invoice.pinned } : invoice
    );
    updatedInvoices.sort((a, b) => (b.pinned ? 1 : -1));
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
  };

  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(savedInvoices);
  }, []);

  return (
    <>
      {!showSidebar && (
        <div
          className="fixed right-4 top-4 z-50 cursor-pointer text-[#fe5000] hover:text-[#fe7000]"
          onClick={toggleSidebar}
        >
          <MdMenuBook size={45} />
        </div>
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-full w-96 bg-gray-900 p-4 text-white shadow-lg transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute left-4 top-4 text-2xl text-[#fe7000]"
          onClick={toggleSidebar}
        >
          <MdClose />
        </button>

        <h2 className="mb-4 mt-10 text-xl font-bold">Invoice History</h2>

        {invoices.length === 0 ? (
          <p>No history available</p>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-lg bg-gray-800 p-3 shadow-md"
              >
                <h3 className="font-bold">{invoice.cashierName}</h3>
                <p>Total: ₹{invoice.totalCost}</p>
                <p>Advance: ₹{invoice.totalAdvance}</p>
                <p className="text-red-400">
                  Pending: ₹{invoice.remainingPayment}
                </p>

                {/* Buttons */}
                <div className="mt-2 flex justify-between">
                  <button
                    className="text-red-500"
                    onClick={() => deleteInvoice(invoice.id)}
                  >
                    <MdDelete size={22} />
                  </button>
                  <button
                    className="text-yellow-500"
                    onClick={() => onEdit(invoice)}
                  >
                    {" "}
                    <MdEdit size={22} />
                  </button>
                  <button
                    className={`${
                      invoice.pinned ? "text-green-400" : "text-gray-400"
                    }`}
                    onClick={() => pinInvoice(invoice.id)}
                  >
                    <MdPushPin size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
