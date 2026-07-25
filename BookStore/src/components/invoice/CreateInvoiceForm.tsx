"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  Save,
  Download,
  Send,
  ChevronDown,
} from "lucide-react";

type LineItem = {
  id: number;
  name: string;
  details: string;
  rate: number;
  quantity: number;
};

const NOTES_DEFAULT =
  "All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If account is not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged the agreed quoted fee noted above.";

const inputClass =
  "w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 py-2 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";

const labelClass = "mb-1.5 block text-[12px] font-medium text-[#878a99]";

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function CreateInvoiceForm() {
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, name: "", details: "", rate: 0, quantity: 0 },
  ]);
  const [sameAddress, setSameAddress] = useState(false);
  const [shippingCharge, setShippingCharge] = useState(0);

  const subTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.rate * item.quantity, 0),
    [items],
  );
  const estimatedTax = subTotal * 0.125;
  const discount = subTotal > 0 ? Math.min(subTotal * 0.05, 50) : 0;
  const total = Math.max(subTotal + estimatedTax - discount + shippingCharge, 0);

  const updateItem = (id: number, patch: Partial<LineItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        details: "",
        rate: 0,
        quantity: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((prev) =>
      prev.length === 1
        ? [{ id: prev[0].id, name: "", details: "", rate: 0, quantity: 0 }]
        : prev.filter((item) => item.id !== id),
    );
  };

  return (
    <div className="card">
      <div className="card-body p-4 sm:p-6">
        {/* Company header */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
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
              <span className="text-[20px] font-bold tracking-wide text-[#405189]">
                VELZON
              </span>
            </div>

            <label className={labelClass}>Address</label>
            <textarea
              className={`${inputClass} mb-3 min-h-[88px] resize-y`}
              placeholder="Company Address"
              defaultValue=""
            />
            <input
              className={inputClass}
              placeholder="Enter Postal Code"
              defaultValue=""
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className={labelClass}>Legal Registration No</label>
              <input className={inputClass} placeholder="legal registration no" />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                className={inputClass}
                placeholder="Email Address"
              />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input className={inputClass} placeholder="Website" />
            </div>
            <div>
              <label className={labelClass}>Contact No</label>
              <input className={inputClass} placeholder="Contact No" />
            </div>
          </div>
        </div>

        <hr className="my-5 border-[#e9ebec]" />

        {/* Invoice meta */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className={labelClass}>Invoice No</label>
            <input className={inputClass} defaultValue="#VL25000355" readOnly />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="datetime-local"
              className={inputClass}
              placeholder="Select Date-time"
            />
          </div>
          <div>
            <label className={labelClass}>Payment Status</label>
            <div className="relative">
              <select className={`${inputClass} appearance-none pr-8`}>
                <option value="">Select Payment Status</option>
                <option>Paid</option>
                <option>Unpaid</option>
                <option>Refund</option>
                <option>Cancel</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#878a99]"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Total Amount</label>
            <input className={inputClass} value={money(total)} readOnly />
          </div>
        </div>

        {/* Billing / Shipping */}
        <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h6 className="mb-3 text-[13px] font-semibold tracking-wide text-[#495057] uppercase">
              Billing Address
            </h6>
            <div className="space-y-3">
              <input className={inputClass} placeholder="Full Name" />
              <textarea
                className={`${inputClass} min-h-[72px] resize-y`}
                placeholder="Address"
              />
              <input className={inputClass} placeholder="(123)456-7890" />
              <input className={inputClass} placeholder="Tax Number" />
            </div>
          </div>
          <div>
            <h6 className="mb-3 text-[13px] font-semibold tracking-wide text-[#495057] uppercase">
              Shipping Address
            </h6>
            <div className="space-y-3">
              <input
                className={inputClass}
                placeholder="Full Name"
                disabled={sameAddress}
              />
              <textarea
                className={`${inputClass} min-h-[72px] resize-y`}
                placeholder="Address"
                disabled={sameAddress}
              />
              <input
                className={inputClass}
                placeholder="(123)456-7890"
                disabled={sameAddress}
              />
              <input
                className={inputClass}
                placeholder="Tax Number"
                disabled={sameAddress}
              />
            </div>
          </div>
        </div>

        <label className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] text-[#495057]">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#405189]"
            checked={sameAddress}
            onChange={(e) => setSameAddress(e.target.checked)}
          />
          Will your Billing and Shipping address same?
        </label>

        {/* Products table */}
        <div className="mb-4 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e9ebec] text-[12px] text-[#878a99]">
                <th className="w-10 py-3 font-medium">#</th>
                <th className="py-3 pr-3 font-medium">Product Details</th>
                <th className="w-[120px] py-3 pr-3 font-medium">Rate ($)</th>
                <th className="w-[150px] py-3 pr-3 font-medium">Quantity</th>
                <th className="w-[110px] py-3 pr-3 font-medium">Amount</th>
                <th className="w-[90px] py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const amount = item.rate * item.quantity;
                return (
                  <tr key={item.id} className="border-b border-[#e9ebec] align-top">
                    <td className="py-4 text-[13px] font-medium text-[#495057]">
                      {index + 1}
                    </td>
                    <td className="py-4 pr-3">
                      <input
                        className={`${inputClass} mb-2`}
                        placeholder="Product Name"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, { name: e.target.value })
                        }
                      />
                      <textarea
                        className={`${inputClass} min-h-[64px] resize-y`}
                        placeholder="Product Details"
                        value={item.details}
                        onChange={(e) =>
                          updateItem(item.id, { details: e.target.value })
                        }
                      />
                    </td>
                    <td className="py-4 pr-3">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        className={inputClass}
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(item.id, {
                            rate: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </td>
                    <td className="py-4 pr-3">
                      <div className="flex overflow-hidden rounded border border-[#e9ebec]">
                        <button
                          type="button"
                          className="flex h-9 w-9 cursor-pointer items-center justify-center border-0 bg-[#f3f6f9] text-[#495057] hover:bg-[#e9ebec]"
                          onClick={() =>
                            updateItem(item.id, {
                              quantity: Math.max(0, item.quantity - 1),
                            })
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min={0}
                          className="h-9 w-full border-0 bg-white text-center text-[13px] text-[#495057] outline-none"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, {
                              quantity: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                        />
                        <button
                          type="button"
                          className="flex h-9 w-9 cursor-pointer items-center justify-center border-0 bg-[#f3f6f9] text-[#495057] hover:bg-[#e9ebec]"
                          onClick={() =>
                            updateItem(item.id, {
                              quantity: item.quantity + 1,
                            })
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 pr-3">
                      <input
                        className={inputClass}
                        value={money(amount)}
                        readOnly
                      />
                    </td>
                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded border-0 bg-[#0ab39c] px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-[#099885]"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mb-6 inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#e1f0fa] px-3 py-2 text-[13px] font-medium text-[#299cdb] hover:bg-[#d0e8f6]"
        >
          <Plus size={15} />
          Add Item
        </button>

        {/* Payment + totals */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h6 className="mb-3 text-[13px] font-semibold tracking-wide text-[#495057] uppercase">
              Payment Details
            </h6>
            <div className="space-y-3">
              <div className="relative">
                <select className={`${inputClass} appearance-none pr-8`}>
                  <option value="">Payment Method</option>
                  <option>Mastercard</option>
                  <option>Credit Card</option>
                  <option>Paypal</option>
                  <option>Visa</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#878a99]"
                />
              </div>
              <input className={inputClass} placeholder="Card Holder Name" />
              <input
                className={inputClass}
                placeholder="XXXX XXXX XXXX XXXX"
              />
              <input className={inputClass} value={money(total)} readOnly />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="ml-auto w-full max-w-md space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#878a99]">Sub Total</span>
                <input
                  className={`${inputClass} !w-[140px] text-right`}
                  value={money(subTotal)}
                  readOnly
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#878a99]">
                  Estimated Tax (12.5%)
                </span>
                <input
                  className={`${inputClass} !w-[140px] text-right`}
                  value={money(estimatedTax)}
                  readOnly
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#878a99]">
                  Discount
                  <span className="ml-1 rounded bg-[#e2e5ed] px-1.5 py-0.5 text-[10px] font-semibold text-[#405189]">
                    VELZON15
                  </span>
                </span>
                <input
                  className={`${inputClass} !w-[140px] text-right`}
                  value={money(discount)}
                  readOnly
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#878a99]">
                  Shipping Charge
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={`${inputClass} !w-[140px] text-right`}
                  value={shippingCharge}
                  onChange={(e) =>
                    setShippingCharge(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-[#e9ebec] pt-2.5">
                <span className="text-[13px] font-semibold text-[#495057]">
                  Total Amount
                </span>
                <input
                  className={`${inputClass} !w-[140px] text-right font-semibold`}
                  value={money(total)}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="mb-2 block text-[13px] font-semibold tracking-wide text-[#495057] uppercase">
            NOTES
          </label>
          <textarea
            className="min-h-[110px] w-full resize-y rounded border border-[#cfe2ff] bg-[#eef5ff] px-3 py-3 text-[13px] leading-relaxed text-[#495057] outline-none focus:border-[#405189]"
            defaultValue={NOTES_DEFAULT}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[#099885]"
          >
            <Save size={15} />
            Save
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#405189] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[#364574]"
          >
            <Download size={15} />
            Download Invoice
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#f06548] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[#e35338]"
          >
            <Send size={15} />
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
