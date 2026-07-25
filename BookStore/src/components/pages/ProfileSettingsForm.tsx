"use client";

import { useState } from "react";

const tabs = [
  "Personal Details",
  "Change Password",
  "Experience",
  "Privacy Policy",
] as const;

export default function ProfileSettingsForm() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Personal Details");

  return (
    <div className="card">
      <div className="border-b border-[#e9ebec] px-4">
        <div className="flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-0 border-b-2 bg-transparent px-3 py-3 text-[13px] font-medium transition-colors ${
                tab === t
                  ? "border-[#405189] text-[#405189]"
                  : "border-transparent text-[#878a99] hover:text-[#495057]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="card-body">
        {tab === "Personal Details" && (
          <form className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">
                First Name
              </label>
              <input
                defaultValue="Anna"
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">
                Last Name
              </label>
              <input
                defaultValue="Adame"
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">
                Email
              </label>
              <input
                type="email"
                defaultValue="anna@themesbrand.com"
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">
                Bio
              </label>
              <textarea
                rows={3}
                defaultValue="Hi I'm Anna Adame..."
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded border-0 bg-[#0ab39c] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#099885]"
              >
                Update
              </button>
            </div>
          </form>
        )}
        {tab === "Change Password" && (
          <form className="max-w-md space-y-4">
            {["Old Password", "New Password", "Confirm Password"].map((l) => (
              <div key={l}>
                <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">
                  {l}
                </label>
                <input
                  type="password"
                  className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
                />
              </div>
            ))}
            <button
              type="submit"
              className="rounded border-0 bg-[#0ab39c] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#099885]"
            >
              Change Password
            </button>
          </form>
        )}
        {tab === "Experience" && (
          <div className="space-y-4 text-[13px]">
            <div className="rounded border border-[#e9ebec] p-4">
              <h6 className="m-0 font-semibold text-[#495057]">
                UI/UX Design – Themesbrand
              </h6>
              <p className="mt-1 mb-0 text-[#878a99]">2019 – Present</p>
            </div>
            <div className="rounded border border-[#e9ebec] p-4">
              <h6 className="m-0 font-semibold text-[#495057]">
                Product Designer – Soft Agency
              </h6>
              <p className="mt-1 mb-0 text-[#878a99]">2016 – 2019</p>
            </div>
          </div>
        )}
        {tab === "Privacy Policy" && (
          <div className="max-w-2xl space-y-3 text-[13px] text-[#878a99]">
            <p className="m-0">
              Your privacy is important to us. We only use account information to
              provide and improve our products and services.
            </p>
            <label className="flex items-center gap-2 text-[#495057]">
              <input type="checkbox" defaultChecked className="accent-[#405189]" />
              Allow others to see my profile
            </label>
            <label className="flex items-center gap-2 text-[#495057]">
              <input type="checkbox" className="accent-[#405189]" />
              Show my email address publicly
            </label>
            <button
              type="button"
              className="mt-2 rounded border-0 bg-[#0ab39c] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#099885]"
            >
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
