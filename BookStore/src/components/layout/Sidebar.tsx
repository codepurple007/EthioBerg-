"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Grid3x3,
  LayoutTemplate,
  Lock,
  FileText,
  Rocket,
  Boxes,
  Layers,
  Puzzle,
  FormInput,
  Table2,
  PieChart,
  Smile,
  Map,
  ListTree,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type MenuChild = {
  label: string;
  href?: string;
  badge?: "new" | "hot";
  children?: MenuChild[];
};

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: "new" | "hot";
  children?: MenuChild[];
};

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: "MENU",
    items: [
      {
        label: "Dashboards",
        icon: <LayoutDashboard size={16} />,
        children: [
          { label: "Analytics", href: "/" },
          { label: "CRM", href: "/dashboards/crm" },
          { label: "Ecommerce", href: "/dashboards/ecommerce" },
          { label: "Crypto", href: "/dashboards/crypto" },
          { label: "Projects", href: "/dashboards/projects" },
          { label: "NFT", href: "/dashboards/nft" },
          { label: "Job", href: "/dashboards/job" },
          { label: "Blog", href: "/dashboards/blog", badge: "new" },
        ],
      },
      {
        label: "Apps",
        icon: <Grid3x3 size={16} />,
        children: [
          {
            label: "Calendar",
            href: "/apps/calendar",
            children: [
              { label: "Main", href: "/apps/calendar" },
              { label: "Month Grid", href: "/apps/calendar/month-grid" },
            ],
          },
          { label: "Chat", href: "/apps/chat" },
          {
            label: "Email",
            href: "/apps/email/mailbox",
            children: [
              { label: "Mailbox", href: "/apps/email/mailbox" },
              { label: "Basic Action", href: "/apps/email/basic" },
              { label: "Ecommerce Action", href: "/apps/email/ecommerce" },
            ],
          },
          {
            label: "Ecommerce",
            href: "/apps/ecommerce/products",
            children: [
              { label: "Products", href: "/apps/ecommerce/products" },
              { label: "Product Details", href: "/apps/ecommerce/product-details" },
              { label: "Create Product", href: "/apps/ecommerce/add-product" },
              { label: "Orders", href: "/apps/ecommerce/orders" },
              { label: "Order Details", href: "/apps/ecommerce/order-details" },
              { label: "Customers", href: "/apps/ecommerce/customers" },
              { label: "Shopping Cart", href: "/apps/ecommerce/cart" },
              { label: "Checkout", href: "/apps/ecommerce/checkout" },
              { label: "Sellers", href: "/apps/ecommerce/sellers" },
              { label: "Seller Details", href: "/apps/ecommerce/seller-details" },
            ],
          },
          {
            label: "Projects",
            href: "/apps/projects/list",
            children: [
              { label: "List", href: "/apps/projects/list" },
              { label: "Overview", href: "/apps/projects/overview" },
              { label: "Create Project", href: "/apps/projects/create" },
            ],
          },
          {
            label: "Tasks",
            href: "/apps/tasks/kanban",
            children: [
              { label: "Kanban Board", href: "/apps/tasks/kanban" },
              { label: "List View", href: "/apps/tasks/list" },
              { label: "Task Details", href: "/apps/tasks/details" },
            ],
          },
          {
            label: "CRM",
            href: "/apps/crm/contacts",
            children: [
              { label: "Contacts", href: "/apps/crm/contacts" },
              { label: "Companies", href: "/apps/crm/companies" },
              { label: "Deals", href: "/apps/crm/deals" },
              { label: "Leads", href: "/apps/crm/leads" },
            ],
          },
          {
            label: "Crypto",
            href: "/apps/crypto/transactions",
            children: [
              { label: "Transactions", href: "/apps/crypto/transactions" },
              { label: "Buy & Sell", href: "/apps/crypto/buy-sell" },
              { label: "Orders", href: "/apps/crypto/orders" },
              { label: "My Wallet", href: "/apps/crypto/wallet" },
              { label: "ICO List", href: "/apps/crypto/ico" },
              { label: "KYC Application", href: "/apps/crypto/kyc" },
            ],
          },
          {
            label: "Invoices",
            href: "/apps/invoices/list",
            children: [
              { label: "List View", href: "/apps/invoices/list" },
              { label: "Details", href: "/apps/invoices/details" },
              { label: "Create Invoice", href: "/apps/invoices/create" },
            ],
          },
          {
            label: "Support Tickets",
            href: "/apps/tickets/list",
            children: [
              { label: "List View", href: "/apps/tickets/list" },
              { label: "Ticket Details", href: "/apps/tickets/details" },
            ],
          },
          {
            label: "NFT Marketplace",
            href: "/apps/nft/marketplace",
            children: [
              { label: "Marketplace", href: "/apps/nft/marketplace" },
              { label: "Explore Now", href: "/apps/nft/explore" },
              { label: "Live Auction", href: "/apps/nft/auction" },
              { label: "Item Details", href: "/apps/nft/item-details" },
              { label: "Collections", href: "/apps/nft/collections" },
              { label: "Creators", href: "/apps/nft/creators" },
              { label: "Ranking", href: "/apps/nft/ranking" },
              { label: "Wallet Connect", href: "/apps/nft/wallet" },
              { label: "Create NFT", href: "/apps/nft/create" },
            ],
          },
          { label: "File Manager", href: "/apps/file-manager" },
          { label: "To Do", href: "/apps/todo" },
          {
            label: "Jobs",
            href: "/apps/jobs/statistics",
            children: [
              { label: "Statistics", href: "/apps/jobs/statistics" },
              { label: "Job Lists", href: "/apps/jobs/list" },
              { label: "Job Grid Lists", href: "/apps/jobs/grid" },
              { label: "Job Overview", href: "/apps/jobs/overview" },
              { label: "Candidate Lists", href: "/apps/jobs/candidates/list" },
              { label: "Candidate Grid", href: "/apps/jobs/candidates/grid" },
              { label: "Application", href: "/apps/jobs/application" },
              { label: "New Job", href: "/apps/jobs/new" },
              { label: "Companies List", href: "/apps/jobs/companies" },
              { label: "Job Categories", href: "/apps/jobs/categories" },
            ],
          },
          { label: "API Key", href: "/apps/api-key" },
        ],
      },
      {
        label: "Layouts",
        icon: <LayoutTemplate size={16} />,
        badge: "hot",
        children: [
          { label: "Vertical", href: "/" },
          { label: "Horizontal", href: "/" },
          { label: "Two Column", href: "/" },
        ],
      },
    ],
  },
  {
    title: "PAGES",
    items: [
      {
        label: "Authentication",
        icon: <Lock size={16} />,
        children: [
          { label: "Sign In", href: "/auth/signin" },
          { label: "Sign Up", href: "/auth/signup" },
          { label: "Password Reset", href: "/auth/reset-password" },
          { label: "Lock Screen", href: "/auth/lock-screen" },
          { label: "Logout", href: "/auth/logout" },
          { label: "404 Error", href: "/auth/404" },
          { label: "500 Error", href: "/auth/500" },
        ],
      },
      {
        label: "Pages",
        icon: <FileText size={16} />,
        children: [
          { label: "Starter", href: "/pages/starter" },
          { label: "Profile", href: "/pages/profile" },
          { label: "Profile Settings", href: "/pages/profile/settings" },
          { label: "Team", href: "/pages/team" },
          { label: "Timeline", href: "/pages/timeline" },
          { label: "FAQs", href: "/pages/faqs" },
          { label: "Pricing", href: "/pages/pricing" },
          { label: "Gallery", href: "/pages/gallery" },
          { label: "Maintenance", href: "/pages/maintenance" },
          { label: "Coming Soon", href: "/pages/coming-soon" },
          { label: "Sitemap", href: "/pages/sitemap" },
          { label: "Search Results", href: "/pages/search-results" },
          { label: "Privacy Policy", href: "/pages/privacy-policy" },
          { label: "Terms", href: "/pages/terms" },
        ],
      },
      {
        label: "Landing",
        icon: <Rocket size={16} />,
        children: [
          { label: "One Page", href: "/landing" },
          { label: "NFT Landing", href: "/landing/nft" },
          { label: "Job Landing", href: "/landing/job" },
        ],
      },
    ],
  },
  {
    title: "COMPONENTS",
    items: [
      {
        label: "Base UI",
        icon: <Boxes size={16} />,
        children: [
          { label: "Alerts" },
          { label: "Badges" },
          { label: "Buttons" },
          { label: "Colors" },
          { label: "Cards" },
        ],
      },
      {
        label: "Advance UI",
        icon: <Layers size={16} />,
        children: [
          { label: "Sweet Alerts" },
          { label: "Nestable List" },
          { label: "Scrollbar" },
        ],
      },
      { label: "Widgets", icon: <Puzzle size={16} /> },
      {
        label: "Forms",
        icon: <FormInput size={16} />,
        children: [
          { label: "Basic Elements" },
          { label: "Form Select" },
          { label: "Checkboxs & Radios" },
        ],
      },
      {
        label: "Tables",
        icon: <Table2 size={16} />,
        children: [
          { label: "Basic Tables" },
          { label: "Grid Js" },
          { label: "List Js" },
        ],
      },
      {
        label: "Charts",
        icon: <PieChart size={16} />,
        children: [
          { label: "Apexcharts" },
          { label: "Chartjs" },
          { label: "Echarts" },
        ],
      },
      {
        label: "Icons",
        icon: <Smile size={16} />,
        children: [
          { label: "Remix" },
          { label: "Boxicons" },
          { label: "Material Design" },
          { label: "Lucide" },
        ],
      },
      {
        label: "Maps",
        icon: <Map size={16} />,
        children: [
          { label: "Google" },
          { label: "Vector" },
          { label: "Leaflet" },
        ],
      },
      {
        label: "Multi Level",
        icon: <ListTree size={16} />,
        children: [{ label: "Level 1.1" }, { label: "Level 1.2" }],
      },
    ],
  },
];

function isPathActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemContainsActive(
  children: MenuChild[] | undefined,
  pathname: string,
): boolean {
  if (!children) return false;
  return children.some(
    (c) =>
      isPathActive(pathname, c.href) ||
      itemContainsActive(c.children, pathname),
  );
}

function collectOpenLabels(
  items: MenuItem[] | MenuChild[],
  pathname: string,
  acc: Record<string, boolean> = {},
): Record<string, boolean> {
  for (const item of items) {
    if (item.children?.length) {
      if (
        isPathActive(pathname, item.href) ||
        itemContainsActive(item.children, pathname)
      ) {
        acc[item.label] = true;
      }
      collectOpenLabels(item.children, pathname, acc);
    }
  }
  return acc;
}

type SidebarProps = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate: _onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const open: Record<string, boolean> = {};
    for (const section of menuSections) {
      Object.assign(open, collectOpenLabels(section.items, pathname));
    }
    return open;
  });

  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const section of menuSections) {
      Object.assign(next, collectOpenLabels(section.items, pathname));
    }
    setOpenMenus((prev) => ({ ...prev, ...next }));
  }, [pathname]);

  const toggle = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };


  const renderChildren = (children: MenuChild[], depth = 0) => (
    <ul className={`m-0 list-none py-1 ${depth === 0 ? "pl-9" : "pl-4"}`}>
      {children.map((child) => {
        const hasNested = !!child.children?.length;
        const nestedOpen = openMenus[child.label] ?? false;
        const active =
          isPathActive(pathname, child.href) ||
          itemContainsActive(child.children, pathname);

        if (hasNested) {
          return (
            <li key={child.label}>
              <div className="flex items-center">
                {child.href ? (
                  <a
                    href={child.href}
                   
                    className={`relative min-w-0 flex-1 py-1.5 pl-3 text-left text-[13px] no-underline transition-colors before:absolute before:top-1/2 before:left-0 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:content-[''] ${
                      active
                        ? "font-medium text-white before:bg-white"
                        : "text-[#abb9e8] before:bg-[#abb9e8] hover:text-white"
                    }`}
                  >
                    <span className="truncate">{child.label}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggle(child.label)}
                    className="relative flex min-w-0 flex-1 cursor-pointer items-center border-0 bg-transparent py-1.5 pl-3 text-left text-[13px] text-[#abb9e8] transition-colors before:absolute before:top-1/2 before:left-0 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-[#abb9e8] before:content-[''] hover:text-white"
                  >
                    <span className="truncate">{child.label}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggle(child.label)}
                  className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-[#abb9e8] hover:text-white"
                  aria-label={`Toggle ${child.label}`}
                >
                  {nestedOpen ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                </button>
              </div>
              {nestedOpen && renderChildren(child.children!, depth + 1)}
            </li>
          );
        }

        if (!child.href) {
          return (
            <li key={child.label}>
              <span className="relative block py-1.5 pl-3 text-[13px] text-[#838fb9] before:absolute before:top-1/2 before:left-0 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-[#838fb9] before:content-['']">
                {child.label}
              </span>
            </li>
          );
        }

        return (
          <li key={child.label}>
            <a
              href={child.href}
             
              className={`relative block py-1.5 pl-3 text-[13px] no-underline transition-colors before:absolute before:top-1/2 before:left-0 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:content-[''] ${
                active
                  ? "font-medium text-white before:bg-white"
                  : "text-[#abb9e8] before:bg-[#abb9e8] hover:text-white"
              }`}
            >
              {child.label}
              {child.badge === "new" && (
                <span className="badge-new">New</span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-[250px] flex-col bg-[#405189] text-white">
      <div className="flex h-[70px] shrink-0 items-center px-6">
        <a
          href="/"
         
          className="flex items-center gap-2 no-underline"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#0ab39c" />
            <path
              d="M2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[22px] font-bold tracking-wide text-white">
            VELZON
          </span>
        </a>
      </div>

      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 pb-6">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-3">
            <p className="mb-1 px-3 pt-3 text-[11px] font-semibold tracking-wider text-[#838fb9]">
              {section.title}
            </p>
            <ul className="m-0 list-none p-0">
              {section.items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isOpen =
                  openMenus[item.label] ??
                  itemContainsActive(item.children, pathname);

                return (
                  <li key={item.label} className="mb-0.5">
                    <button
                      type="button"
                      onClick={() => hasChildren && toggle(item.label)}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded px-3 py-2.5 text-left text-[13.5px] text-[#abb9e8] transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <span className="shrink-0 opacity-90">{item.icon}</span>
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge === "hot" && (
                        <span className="badge-hot">Hot</span>
                      )}
                      {hasChildren &&
                        (isOpen ? (
                          <ChevronDown size={14} className="opacity-70" />
                        ) : (
                          <ChevronRight size={14} className="opacity-70" />
                        ))}
                    </button>

                    {hasChildren && isOpen && renderChildren(item.children!)}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
