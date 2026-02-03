"use client";

import { useGetCustomerOrderByOrderNumber } from "@/hooks";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Download, Mail } from "lucide-react";

export default function ReceiptPage() {
  const { orderNumber } = useParams();
  const { data: order, isLoading } = useGetCustomerOrderByOrderNumber(
    orderNumber as string,
  );

  const downloadPDF = () => {
    window.print();
  };
  const formatDateTime = (date: string | Date) => {
    const d = new Date(date);

    const formatted = d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formatted} | ${time}`;
  };

  if (isLoading || !order) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading receipt...</p>
        </div>
      </div>
    );
  }

  const currency =
    {
      USD: "$",
      NGN: "₦",
      EUR: "€",
    }[order.currency] || order.currency;

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          body * {
            visibility: hidden;
          }
          #receipt-container,
          #receipt-container * {
            visibility: visible;
          }
          #receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          .no-print {
            display: none !important;
          }
          /* Ensure borders print */
          .print-border {
            border: 1px solid #000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-border-top {
            border-top: 1px solid #000 !important;
          }
          .print-border-bottom {
            border-bottom: 1px solid #000 !important;
          }
          /* Ensure backgrounds print */
          .print-bg {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-header-bg {
            background-color: #1a1a1a !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="w-full min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Download Button */}
          <div className="no-print mb-4 flex justify-end">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <div
            id="receipt-container"
            className="bg-white shadow-sm border border-gray-200"
          >
            {/* Header */}
            <div className="print-header-bg bg-gray-900 text-white px-8 py-6">
              <div className="flex items-start justify-between">
                <Image
                  src="https://res.cloudinary.com/ddi3mvlj4/image/upload/kbc-logo_mhy39q.png"
                  alt="KBC Universe"
                  width={70}
                  height={70}
                  className="bg-none rounded p-1"
                  sizes="100px"
                />
                <h1 className="text-xl font-bold mb-1">INVOICE</h1>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Bill To
                  </p>
                  <p className="font-semibold text-gray-900">
                    {order.shippingFullName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.shippingStreet}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingCity}, {order.shippingState}{" "}
                    {order.shippingPostal}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingCountry}
                  </p>
                  {order.shippingPhone && (
                    <p className="text-sm text-gray-600 mt-2">
                      {order.shippingPhone}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Invoice Number
                    </p>
                    <p className="font-mono font-semibold text-gray-900">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Invoice Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Payment Method
                    </p>
                    <p className="text-sm text-gray-900 capitalize">
                      {order.paymentProvider}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="print-border-bottom border-b border-gray-300">
                      <th className="text-left text-xs text-gray-600 uppercase tracking-wide font-semibold pb-3">
                        Item
                      </th>
                      <th className="text-center text-xs text-gray-600 uppercase tracking-wide font-semibold pb-3">
                        Qty
                      </th>
                      <th className="text-right text-xs text-gray-600 uppercase tracking-wide font-semibold pb-3">
                        Price
                      </th>
                      <th className="text-right text-xs text-gray-600 uppercase tracking-wide font-semibold pb-3">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr
                        key={item.id}
                        className="print-border-bottom border-b border-gray-200"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.imageUrl ?? "/placeholder.png"}
                              alt={item.product.title_en}
                              width={40}
                              height={40}
                              className="rounded border border-gray-200"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.product.title_en}
                              </p>
                              {item.variant && (
                                <p className="text-xs text-gray-500">
                                  {item.variant.color?.label} /{" "}
                                  {item.variant.size?.label.toUpperCase()}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="py-3 text-right text-sm text-gray-900">
                          {currency}
                          {item.priceLocal.toFixed(2)}
                        </td>
                        <td className="py-3 text-right text-sm font-medium text-gray-900">
                          {currency}
                          {(item.priceLocal * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      {currency}
                      {order.subtotalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 text-sm print-border-bottom border-b border-gray-200">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-medium">
                      {currency}
                      {order.shippingAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 print-border-top border-t-2 border-gray-900">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {currency}
                      {order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* PAYMENT + STATUS BLOCK */}
              <div className="mt-6 space-y-6">
                {/* Payment Details */}
                <div className="print-bg bg-gray-50 border print-border border-gray-200 rounded p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    Payment Details
                  </h3>

                  <div className="space-y-3">
                    {/* Row 1: Payment Status */}
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <p className="text-xs text-gray-500  tracking-wide">
                        Payment Status
                      </p>
                      <p className="font-semibold text-gray-900 text-right">
                        {order.paymentStatus}
                      </p>
                    </div>

                    {/* Row 2: Payment Provider */}
                    <div className="grid grid-cols-2 gap-4 items-center py-3 border-t border-gray-300">
                      <p className="text-xs text-gray-500  tracking-wide">
                        Payment Provider
                      </p>
                      <p className="font-semibold text-gray-900 capitalize text-right">
                        {order.paymentProvider}
                      </p>
                    </div>

                    {/* Row 3: Payment Received At */}
                    {order.paidAt && (
                      <div className="grid grid-cols-2 gap-4 items-center py-3 border-t border-gray-300">
                        <p className="text-xs text-gray-500  tracking-wide">
                          Payment Received At
                        </p>
                        <p className="font-mono text-sm text-gray-900 text-right">
                          {formatDateTime(order.paidAt)}
                        </p>
                      </div>
                    )}

                    {/* Transaction ID */}
                    {order.flwId && (
                      <div className="grid grid-cols-2 gap-4 items-center py-3 border-t border-gray-300">
                        <p className="text-xs text-gray-500  tracking-wide">
                          Transaction ID
                        </p>
                        <p className="text-xs font-mono text-gray-900 break-all text-right">
                          {order.flwId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cancellation Details */}
                {order.cancelledAt && (
                  <div className="print-bg bg-gray-50 border print-border border-gray-200 rounded p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">
                      Cancellation Details
                    </h3>

                    <div className="space-y-3">
                      {/* Row 1: Current Status */}
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <p className="text-xs text-gray-500  tracking-wide">
                          Current Status
                        </p>
                        <p className="font-semibold text-gray-900 text-right">
                          {order.status}
                        </p>
                      </div>

                      {/* Row 2: Order ID */}
                      <div className="grid grid-cols-2 gap-4 items-center py-3 border-t border-gray-300">
                        <p className="text-xs text-gray-500  tracking-wide">
                          Order ID
                        </p>
                        <p className="text-xs font-mono text-gray-900 break-all text-right">
                          {order.id}
                        </p>
                      </div>

                      {/* Row 3: Cancelled At */}
                      <div className="grid grid-cols-2 gap-4 items-center py-3 border-t border-gray-300">
                        <p className="text-xs text-gray-500  tracking-wide">
                          Order Cancelled At
                        </p>
                        <p className="text-sm font-mono text-gray-900 text-right">
                          {formatDateTime(order.cancelledAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Status (only show if NOT cancelled) */}
                {!order.cancelledAt && (
                  <div className="print-bg bg-gray-50 border print-border border-gray-200 rounded p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">
                      Order Status
                    </h3>

                    <div className="space-y-3">
                      {/* Row 1: Current Status */}
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <p className="text-xs text-gray-500  tracking-wide">
                          Current Status
                        </p>
                        <p className="font-semibold text-gray-900 text-right">
                          {order.status}
                        </p>
                      </div>

                      {/* Row 2: Order ID */}
                      <div className="grid grid-cols-2 gap-4 items-center py-3 border-t border-gray-300">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Order ID
                        </p>
                        <p className="text-xs font-mono text-gray-900 break-all text-right">
                          {order.id}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 print-border-top border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500 mb-2">
                  Thank you for your business
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <Mail className="w-3 h-3" />
                  <a
                    href="mailto:sales@kbcuniverse.com"
                    className="hover:text-gray-900"
                  >
                    sales@kbcuniverse.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
