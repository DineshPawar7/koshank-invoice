import React, { useState, useEffect, useCallback } from "react";
import { MdDelete, MdEdit, MdPushPin, MdMenuBook, MdClose, MdSearch } from "react-icons/md";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const Sidebar = ({ setInvoices, onEdit }) => { 

  const [showSidebar, setShowSidebar] = useState(false);
  const [invoices, setLocalInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInvoices = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const invoicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLocalInvoices(invoicesData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error("❌ Error fetching invoices:", error);
    }
  }, [setInvoices]);

  // Delete an invoice
  const deleteInvoice = async (id) => {
    try {
      await deleteDoc(doc(db, "invoices", id));
      setLocalInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error("❌ Error deleting invoice:", error);
    }
  };

  const pinInvoice = async (id, pinned) => {
    try {
      await updateDoc(doc(db, "invoices", id), { pinned: !pinned });
      setLocalInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, pinned: !pinned } : invoice
        )
      );
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, pinned: !pinned } : invoice
        )
      );
    } catch (error) {
      console.error("❌ Error updating pin status:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const filteredInvoices = invoices
  .filter((invoice) =>
    (invoice.cashierName || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  )
  .sort((a, b) => {
    const aMatches = (a.cashierName || "").toLowerCase().startsWith((searchTerm || "").toLowerCase());
    const bMatches = (b.cashierName || "").toLowerCase().startsWith((searchTerm || "").toLowerCase());
    return bMatches - aMatches;
  });


  return (
    <>
      {!showSidebar && (
        <button
          className="fixed right-4 top-4 z-50 cursor-pointer text-[#fe5000] hover:text-[#fe7000] transition-all duration-300"
          onClick={toggleSidebar}
        >
          <MdMenuBook size={45} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-96 bg-gray-900 p-4 text-white shadow-lg transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute left-4 top-4 text-2xl text-[#fe7000] hover:text-[#fe5000] transition-all duration-300"
          onClick={toggleSidebar}
        >
          <MdClose />
        </button>

        <h2 className="mb-4 mt-10 text-xl font-bold">Invoice History</h2>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by Client name..."
            className="w-full rounded-lg bg-gray-800 p-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fe5000] transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>

        {filteredInvoices.length === 0 ? (
          <p className="text-gray-400">No invoices found</p>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="relative rounded-lg bg-gray-800 p-4 shadow-md hover:bg-gray-700 transition duration-300"
              >
                <h3 className="font-bold">{invoice.cashierName}</h3>
                <p>Date: {invoice.invoiceDate}</p>
                <p>Total: ₹{invoice.totalCost}</p>
                <p>Advance: ₹{invoice.totalAdvance}</p>
                <p className="text-red-400">Pending: ₹{invoice.remainingPayment}</p>

                <div className="mt-3 flex justify-between items-center">
                  <button
                    className="text-red-500 hover:text-red-400 transition duration-200"
                    onClick={() => deleteInvoice(invoice.id)}
                  >
                    <MdDelete size={22} />
                  </button>

                  <button
                    className="text-yellow-500 hover:text-yellow-400 transition duration-200"
                    onClick={() => onEdit(invoice)}
                  >
                    <MdEdit size={22} />
                  </button>

                  <button
                    className={`transition duration-200 ${
                      invoice.pinned ? "text-green-400 hover:text-green-300" : "text-gray-400 hover:text-gray-300"
                    }`}
                    onClick={() => pinInvoice(invoice.id, invoice.pinned)}
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
