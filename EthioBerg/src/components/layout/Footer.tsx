export default function Footer() {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#e9ebec] px-6 py-4 text-[13px] text-[#878a99]">
      <p className="m-0">{new Date().getFullYear()} © EthioBerg.</p>
      <p className="m-0">Pre-review only — not ECMA or ESX approval.</p>
    </footer>
  );
}
