import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const InvoiceModal = ({
  isOpen,
  setIsOpen,
  invoiceInfo = {},
  items = [],
  onAddNextInvoice,
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  const addNextInvoiceHandler = () => {
    if (typeof onAddNextInvoice === "function") {
      onAddNextInvoice();
    } else {
      console.error("onAddNextInvoice is not a function");
    }
    setIsOpen(false);
  };

  const SaveAsPDFHandler = () => {
    const dom = document.getElementById("print");

    if (!dom) {
      console.error("Invoice DOM element not found");
      return;
    }

    toPng(dom, { cacheBust: false, quality: 1, pixelRatio: 3 })
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = dataUrl;

        img.onload = () => {
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const imgProps = pdf.getImageProperties(img);
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          

          pdf.addImage(img, "PNG", 0, 0, imgWidth, imgHeight);
          pdf.save(`invoice-${invoiceInfo.today || "unknown"}.pdf`);
        };
      })
      .catch((error) => {
        console.error("Oops, something went wrong!", error);
      });
  };
  

  
  // // Calculate totals
  // const totalQuantity = items.reduce(
  //   (sum, item) => sum + (Number(item.quantity) || 0),
  //   0
  // );
  // const totalCost = items.reduce(
  //   (sum, item) => sum + (Number(item.cost) || 0),
  //   0
  // );
  const totalAdvance = items.reduce(
    (sum, item) => sum + (Number(item.advance) || 0),
    0
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
              
              
              
            <div className="relative p-4" id="print">
  {/* Watermark Text (Center of Table) */}
  

  {/* Header Section */}
  <div className="mb-6 flex justify-between">
    <h1 className="text-lg font-bold" style={{ color: "#fe5000" }}>
      &lt;Koshank /&gt;
    </h1>
    <h1 className="rounded-md bg-[#fe5000] px-2 text-[10px] text-lg font-bold text-white">
      INVOICE
    </h1>
  </div>

  {/* Invoice Details Section */}
  <div className="mt-6">
    <div className="mb-4 grid grid-cols-2">
      <span className="font-semibold text-[10px]">Invoice To</span>
      <span className="text-right font-semibold text-[10px]">
        Date: {invoiceInfo.today}
      </span>
      <span className="text-left text-[10px]">{invoiceInfo.cashierName}</span>
      <span className="text-right text-[10px] text-gray-600">
        koshank.com@koshank.com
      </span>
      <span className="text-left text-[10px]">{invoiceInfo.customerAddress}</span>
      <span className="text-right text-[10px] text-gray-600">
        Deccan, Pune, Maharashtra 411004
      </span>
    </div>

    {/* Items Table */}
    <table className="w-full border border-black text-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
    <h1 className="text-6xl font-bold text-[#fe5000] opacity-5 select-none">
      &lt;Koshank /&gt;
    </h1>
  </div>
      <thead>
        <tr className="border border-black bg-[#fe5000] text-[10px] text-white">
          <th className="border border-black px-2 py-1">SERVICES</th>
          <th className="border border-black px-2 py-1">COST</th>
          <th className="border border-black px-2 py-1">QTY</th>
          <th className="border border-black px-2 py-1">AMOUNT</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-r border-black text-[10px]">
            <td className="border-r border-black px-2">{item.name || "N/A"}</td>
            <td className="border-r border-black px-2">₹{item.quantity || 0}</td>
            <td className="border-l border-black px-2">
              {(Number(item.cost) || 0).toFixed(2)}
            </td>
            <td className="border-l border-black px-2 py-1">
              ₹{(Number(item.advance) || 0).toFixed(2)}
            </td>
          </tr>
        ))}

        {/* Total Calculation */}
        <tr className="border-l border-black text-[10px] font-bold">
          <td className="border-t border-black px-2 py-1 font-normal">
            Advance Payment:
          </td>
          <td className="border-t border-black px-2 py-1"></td>
          <td className="border-t border-b border-black px-2 py-1"></td>
          <td className="border-l border-t border-black px-2">₹{totalAdvance.toFixed(2)}</td>
        </tr>

        <tr className=" border-black text-[10px] font-bold">
          <td className="border-t border-black px-2 py-1 font-normal">
            Remaining Payment:
          </td>
          <td className="border-t border-black px-2 py-1"></td>
          <td className="border-r border-black px-2 py-1"></td>
          <td className="border-t border-black px-2">
            ₹{(invoiceInfo.remainingPayment || 0).toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>

    <div className="mt-6 flex justify-between text-[10px]">
      <div className="text-left">
        <p className="font-bold">Bank Details:</p>
        <p>1. Bank Name - ICICI Bank</p>
        <p>2. Account Name - Shankar Balasaheb Dange</p>
        <p>3. Account Number - 642901511188</p>
        <p>4. Branch - Sinhgad Road</p>
        <p>5. IFSC Code - ICIC0001802</p>
        <p className="font-bold mt-1">OR</p>
        <p>G-Pay no. - 7776916549</p>
      </div>

      {/* Right: Thank You */}
      <div className="text-right font-bold ">
        Thank You!
      </div>
    </div>
  </div>
</div>








              {/* Buttons */}
              <div className="mt-4 flex space-x-2 px-4 pb-6">
                <button
                  className="w-full rounded-md bg-blue-500 py-2 text-sm text-white shadow-sm hover:bg-blue-600"
                  onClick={SaveAsPDFHandler}
                >
                  Download PDF
                </button>
                <button
                  onClick={addNextInvoiceHandler}
                  className="w-full rounded-md border border-blue-500 py-2 text-sm text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white"
                >
                  Back
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InvoiceModal;