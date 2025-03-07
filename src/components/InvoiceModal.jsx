import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const InvoiceModal = ({
  isOpen,
  setIsOpen,
  invoiceInfo,
  items,
  onAddNextInvoice,
}) => {
  function closeModal() {
    setIsOpen(false);
  }

  const addNextInvoiceHandler = () => {
    setIsOpen(false);
    onAddNextInvoice();
  };

  const SaveAsPDFHandler = () => {
    const dom = document.getElementById("print");

    toPng(dom, { cacheBust: false, quality: 1, pixelRatio: 3 }) // ✅ 3x High Quality Image Capture
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
          // const pdfHeight = pdf.internal.pageSize.getHeight();

          // ✅ Maintain Aspect Ratio for High Quality
          const imgProps = pdf.getImageProperties(img);
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          // ✅ Adjust to remove top margin issue
          pdf.addImage(img, "PNG", 0, 0, imgWidth, imgHeight);
          pdf.save(`invoice-${invoiceInfo.today}.pdf`);
        };
      })
      .catch((error) => {
        console.error("Oops, something went wrong!", error);
      });
  };

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
              <div className="p-4" id="print">
                {/* Header Section */}
                <div className="mb-6 flex items-center justify-between">
                  <h1
                    className="text-lg font-bold"
                    style={{ color: "#fe5000" }}
                  >
                    &lt;Koshank /&gt;
                  </h1>

                  <h1
                    className="text-lg text-[10px] font-bold text-white"
                    style={{
                      backgroundColor: "#fe5000",
                      borderRadius: "5px",
                      padding: "2px",
                    }}
                  >
                    INVOICE
                  </h1>
                </div>

                {/* Invoice Details Section */}
                <div className="mt-6">
                  <div className="mb-4 grid grid-cols-2">
                    <span className="text-[10px] font-semibold">
                      Invoice To
                    </span>
                    <span className="text-right text-[10px] font-semibold">
                      Date: {invoiceInfo.today}
                    </span>
                    <span className="text-left text-[10px]">
                      {invoiceInfo.cashierName}
                    </span>
                    <span className="text-right text-[10px] text-gray-600">
                      koshank.com@koshank.com
                    </span>
                    <span className="text-left text-[10px]">
                      {invoiceInfo.customerName}
                    </span>
                    <span className="text-right text-[10px] text-gray-600">
                      Deccan, Pune, Maharashtra 411004
                    </span>
                  </div>

                  {/* Items Table */}
                  <table className="w-full border border-black text-center">
                    <thead>
                      <tr className="border border-black bg-[#fe5000] text-[10px] text-white">
                        <th className="border border-black px-2 py-1">
                          SERVICES
                        </th>
                        <th className="border border-black px-2 py-1 text-center">
                          RECEIVED
                        </th>
                        <th className="border border-black px-2 py-1 text-center">
                          PENDING
                        </th>
                        <th className="border border-black px-2 py-1 text-center">
                          TOTAL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className=" border-l border-black text-center text-[10px]"
                        >
                          <td className="border-l border-black px-2">
                            {item.name}
                          </td>
                          <td className="border-l border-black px-2 text-center">
                            ₹{Number(item.received).toFixed(2)}
                          </td>
                          <td className="border-l border-black px-2 text-center">
                            ₹{Number(item.pending).toFixed(2)}
                          </td>
                          <td className="border-l border-black px-2 text-center">
                            ₹
                            {(
                              Number(item.received) + Number(item.pending)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}

                      {/* Grand Total Row */}
                      <tr className="border-t-1 border-black text-center text-[11px]">
                        <td className="border border-black px-2 py-1 ">
                          Grand Total:
                        </td>
                        <td className="border border-black px-2 py-1 text-center font-bold">
                          ₹
                          {items
                            .reduce(
                              (sum, item) => sum + Number(item.received),
                              0
                            )
                            .toFixed(2)}
                        </td>
                        <td className="border border-black px-2 py-1 text-center font-bold">
                          ₹
                          {items
                            .reduce(
                              (sum, item) => sum + Number(item.pending),
                              0
                            )
                            .toFixed(2)}
                        </td>
                        <td className="border border-black px-2 py-1 text-center font-bold">
                          ₹
                          {items
                            .reduce(
                              (sum, item) =>
                                sum +
                                Number(item.received) +
                                Number(item.pending),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <tr className="mt-9 text-center">
                    <td colSpan="4" className="pt-2 text-center font-bold">
                      Thank You
                    </td>
                  </tr>
                </div>
              </div>
              <div className="mt-4 flex space-x-2 px-4 pb-6">
                <button
                  className="w-full rounded-md border border-blue-500 py-2 text-sm text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white"
                  onClick={SaveAsPDFHandler}
                >
                  Download
                </button>
                <button
                  onClick={addNextInvoiceHandler}
                  className="w-full rounded-md bg-blue-500 py-2 text-sm text-white shadow-sm hover:bg-blue-600"
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
