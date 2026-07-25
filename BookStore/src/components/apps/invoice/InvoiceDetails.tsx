"use client";

import { Printer, Download } from "lucide-react";

const items = [
  {
    id: "01",
    name: "Sweatshirt for Men (Pink)",
    details: "Graphic Print Men & Women Sweatshirt",
    rate: 119.99,
    qty: 2,
  },
  {
    id: "02",
    name: "Noise NoiseFit Endure Smart Watch",
    details: "32.5mm (1.28 Inch) TFT Color Touch Display",
    rate: 94.99,
    qty: 1,
  },
  {
    id: "03",
    name: "350 ml Glass Grocery Container",
    details: "Glass Grocery Container (Pack of 3, White)",
    rate: 24.99,
    qty: 1,
  },
  {
    id: "04",
    name: "Fabric Dual Tone Living Room Chair",
    details: "Chair (White)",
    rate: 340.0,
    qty: 1,
  },
];

export default function InvoiceDetails() {
  const subTotal = items.reduce((s, i) => s + i.rate * i.qty, 0);
  const tax = 44.99;
  const discount = 53.99;
  const shipping = 65.0;
  const total = 755.96;

  return (
    <div className="card">
      <div className="card-body p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#0ab39c" />
                <path
                  d="M2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#405189"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[20px] font-bold text-[#405189]">
                VELZON
              </span>
            </div>
            <p className="m-0 text-[13px] font-semibold text-[#495057]">
              Address
            </p>
            <p className="m-0 text-[13px] text-[#878a99]">
              California, United States
            </p>
            <p className="m-0 text-[13px] text-[#878a99]">Zip-code: 90201</p>
            <p className="m-0 mt-2 text-[13px] text-[#878a99]">
              Legal Registration No: 987654
            </p>
            <p className="m-0 text-[13px] text-[#878a99]">
              Email: velzon@themesbrand.com
            </p>
            <p className="m-0 text-[13px] text-[#878a99]">
              Website: www.themesbrand.com
            </p>
            <p className="m-0 text-[13px] text-[#878a99]">
              Contact No: +(01) 234 6789
            </p>
          </div>
          <div className="text-right">
            <p className="m-0 text-[12px] text-[#878a99]">Invoice No</p>
            <h5 className="m-0 mb-3 text-[18px] font-semibold text-[#405189]">
              #VL25000355
            </h5>
            <p className="m-0 text-[12px] text-[#878a99]">Date</p>
            <p className="m-0 mb-3 text-[14px] font-semibold text-[#495057]">
              23 Nov, 2021 02:36PM
            </p>
            <p className="m-0 text-[12px] text-[#878a99]">Payment Status</p>
            <span className="inline-block rounded bg-[#daf4f0] px-2 py-0.5 text-[11px] font-semibold text-[#0ab39c]">
              Paid
            </span>
            <p className="m-0 mt-3 text-[12px] text-[#878a99]">Total Amount</p>
            <h4 className="m-0 text-[22px] font-semibold text-[#495057]">
              ${total.toFixed(2)}
            </h4>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded border border-[#e9ebec] p-4">
            <p className="m-0 mb-2 text-[13px] font-semibold text-[#495057]">
              Billing Address
            </p>
            <p className="m-0 text-[13px] text-[#495057]">David Nichols</p>
            <p className="m-0 text-[13px] text-[#878a99]">
              305 S San Gabriel Blvd
            </p>
            <p className="m-0 text-[13px] text-[#878a99]">
              Phone: +(123) 456-7890
            </p>
            <p className="m-0 text-[13px] text-[#878a99]">Tax: 12-3456789</p>
          </div>
          <div className="rounded border border-[#e9ebec] p-4">
            <p className="m-0 mb-2 text-[13px] font-semibold text-[#495057]">
              Shipping Address
            </p>
            <p className="m-0 text-[13px] text-[#495057]">David Nichols</p>
            <p className="m-0 text-[13px] text-[#878a99]">
              305 S San Gabriel Blvd
            </p>
            <p className="m-0 text-[13px] text-[#878a99]">
              Phone: +(123) 456-7890
            </p>
          </div>
        </div>

        <div className="mb-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e9ebec] bg-[#f3f3f9] text-[#878a99]">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Product Details</th>
                <th className="px-3 py-2 font-medium">Rate</th>
                <th className="px-3 py-2 font-medium">Quantity</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#e9ebec]">
                  <td className="px-3 py-3 text-[#878a99]">{item.id}</td>
                  <td className="px-3 py-3">
                    <p className="m-0 font-medium text-[#495057]">{item.name}</p>
                    <p className="m-0 text-[12px] text-[#878a99]">
                      {item.details}
                    </p>
                  </td>
                  <td className="px-3 py-3">${item.rate.toFixed(2)}</td>
                  <td className="px-3 py-3">
                    {String(item.qty).padStart(2, "0")}
                  </td>
                  <td className="px-3 py-3 text-right font-medium">
                    ${(item.rate * item.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6 flex justify-end">
          <table className="w-full max-w-xs text-[13px]">
            <tbody>
              {[
                ["Sub Total", `$${subTotal.toFixed(2)}`],
                ["Estimated Tax (12.5%)", `$${tax.toFixed(2)}`],
                ["Discount (VELZON15)", `- $${discount.toFixed(2)}`],
                ["Shipping Charge", `$${shipping.toFixed(2)}`],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td className="py-1 text-[#878a99]">{label}</td>
                  <td className="py-1 text-right text-[#495057]">{value}</td>
                </tr>
              ))}
              <tr className="border-t border-[#e9ebec]">
                <td className="pt-2 font-semibold text-[#495057]">
                  Total Amount
                </td>
                <td className="pt-2 text-right font-semibold text-[#405189]">
                  ${total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 rounded border border-[#e9ebec] bg-[#f3f3f9] p-4">
          <p className="m-0 mb-2 text-[13px] font-semibold text-[#495057]">
            Payment Details:
          </p>
          <div className="grid grid-cols-1 gap-1 text-[13px] sm:grid-cols-2">
            <p className="m-0 text-[#878a99]">
              Payment Method:{" "}
              <span className="text-[#495057]">Mastercard</span>
            </p>
            <p className="m-0 text-[#878a99]">
              Card Holder: <span className="text-[#495057]">David Nichols</span>
            </p>
            <p className="m-0 text-[#878a99]">
              Card Number:{" "}
              <span className="text-[#495057]">xxx xxxx xxxx 1234</span>
            </p>
            <p className="m-0 text-[#878a99]">
              Total Amount:{" "}
              <span className="font-medium text-[#495057]">
                $ {total.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        <p className="m-0 mb-6 text-[12px] text-[#878a99]">
          <strong className="text-[#495057]">NOTES:</strong> All accounts are to
          be paid within 7 days from receipt of invoice. To be paid by cheque or
          credit card or direct payment online. If account is not paid within 7
          days the credits details supplied as confirmation of work undertaken
          will be charged the agreed quoted fee noted above.
        </p>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f3f9]"
          >
            <Printer size={14} /> Print
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#364574]"
          >
            <Download size={14} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}
