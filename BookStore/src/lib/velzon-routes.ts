/**
 * Velzon A+B route inventory (Dashboards + Apps + Auth + Pages).
 * Components (ui-*, forms-*, charts-*, etc.) intentionally excluded.
 */

export type VelzonRoute = {
  label: string;
  html: string;
  path: string;
  group:
    | "dashboards"
    | "apps"
    | "auth"
    | "pages"
    | "landing";
  status: "done" | "todo";
};

export const VELZON_ROUTES: VelzonRoute[] = [
  // Dashboards
  { label: "Analytics", html: "dashboard-analytics.html", path: "/", group: "dashboards", status: "done" },
  { label: "CRM", html: "dashboard-crm.html", path: "/dashboards/crm", group: "dashboards", status: "done" },
  { label: "Ecommerce", html: "index.html", path: "/dashboards/ecommerce", group: "dashboards", status: "done" },
  { label: "Crypto", html: "dashboard-crypto.html", path: "/dashboards/crypto", group: "dashboards", status: "done" },
  { label: "Projects", html: "dashboard-projects.html", path: "/dashboards/projects", group: "dashboards", status: "done" },
  { label: "NFT", html: "dashboard-nft.html", path: "/dashboards/nft", group: "dashboards", status: "done" },
  { label: "Job", html: "dashboard-job.html", path: "/dashboards/job", group: "dashboards", status: "done" },
  { label: "Blog", html: "dashboard-blog.html", path: "/dashboards/blog", group: "dashboards", status: "done" },

  // Invoices / Tickets (partially done)
  { label: "Create Invoice", html: "apps-invoices-create.html", path: "/apps/invoices/create", group: "apps", status: "done" },
  { label: "Invoice List", html: "apps-invoices-list.html", path: "/apps/invoices/list", group: "apps", status: "done" },
  { label: "Invoice Details", html: "apps-invoices-details.html", path: "/apps/invoices/details", group: "apps", status: "done" },
  { label: "Tickets List", html: "apps-tickets-list.html", path: "/apps/tickets/list", group: "apps", status: "done" },
  { label: "Ticket Details", html: "apps-tickets-details.html", path: "/apps/tickets/details", group: "apps", status: "done" },

  // Calendar / Chat / Email
  { label: "Calendar", html: "apps-calendar.html", path: "/apps/calendar", group: "apps", status: "done" },
  { label: "Month Grid", html: "apps-calendar-month-grid.html", path: "/apps/calendar/month-grid", group: "apps", status: "done" },
  { label: "Chat", html: "apps-chat.html", path: "/apps/chat", group: "apps", status: "done" },
  { label: "Mailbox", html: "apps-mailbox.html", path: "/apps/email/mailbox", group: "apps", status: "done" },
  { label: "Email Basic", html: "apps-email-basic.html", path: "/apps/email/basic", group: "apps", status: "done" },
  { label: "Email Ecommerce", html: "apps-email-ecommerce.html", path: "/apps/email/ecommerce", group: "apps", status: "done" },

  // Ecommerce apps
  { label: "Products", html: "apps-ecommerce-products.html", path: "/apps/ecommerce/products", group: "apps", status: "done" },
  { label: "Product Details", html: "apps-ecommerce-product-details.html", path: "/apps/ecommerce/product-details", group: "apps", status: "done" },
  { label: "Create Product", html: "apps-ecommerce-add-product.html", path: "/apps/ecommerce/add-product", group: "apps", status: "done" },
  { label: "Orders", html: "apps-ecommerce-orders.html", path: "/apps/ecommerce/orders", group: "apps", status: "done" },
  { label: "Order Details", html: "apps-ecommerce-order-details.html", path: "/apps/ecommerce/order-details", group: "apps", status: "done" },
  { label: "Customers", html: "apps-ecommerce-customers.html", path: "/apps/ecommerce/customers", group: "apps", status: "done" },
  { label: "Cart", html: "apps-ecommerce-cart.html", path: "/apps/ecommerce/cart", group: "apps", status: "done" },
  { label: "Checkout", html: "apps-ecommerce-checkout.html", path: "/apps/ecommerce/checkout", group: "apps", status: "done" },
  { label: "Sellers", html: "apps-ecommerce-sellers.html", path: "/apps/ecommerce/sellers", group: "apps", status: "done" },
  { label: "Seller Details", html: "apps-ecommerce-seller-details.html", path: "/apps/ecommerce/seller-details", group: "apps", status: "done" },

  // Projects / Tasks
  { label: "Project List", html: "apps-projects-list.html", path: "/apps/projects/list", group: "apps", status: "done" },
  { label: "Project Overview", html: "apps-projects-overview.html", path: "/apps/projects/overview", group: "apps", status: "done" },
  { label: "Create Project", html: "apps-projects-create.html", path: "/apps/projects/create", group: "apps", status: "done" },
  { label: "Kanban", html: "apps-tasks-kanban.html", path: "/apps/tasks/kanban", group: "apps", status: "done" },
  { label: "Task List", html: "apps-tasks-list-view.html", path: "/apps/tasks/list", group: "apps", status: "done" },
  { label: "Task Details", html: "apps-tasks-details.html", path: "/apps/tasks/details", group: "apps", status: "done" },

  // CRM apps
  { label: "Contacts", html: "apps-crm-contacts.html", path: "/apps/crm/contacts", group: "apps", status: "done" },
  { label: "Companies", html: "apps-crm-companies.html", path: "/apps/crm/companies", group: "apps", status: "done" },
  { label: "Deals", html: "apps-crm-deals.html", path: "/apps/crm/deals", group: "apps", status: "done" },
  { label: "Leads", html: "apps-crm-leads.html", path: "/apps/crm/leads", group: "apps", status: "done" },

  // Crypto apps
  { label: "Transactions", html: "apps-crypto-transactions.html", path: "/apps/crypto/transactions", group: "apps", status: "done" },
  { label: "Buy & Sell", html: "apps-crypto-buy-sell.html", path: "/apps/crypto/buy-sell", group: "apps", status: "done" },
  { label: "Crypto Orders", html: "apps-crypto-orders.html", path: "/apps/crypto/orders", group: "apps", status: "done" },
  { label: "Wallet", html: "apps-crypto-wallet.html", path: "/apps/crypto/wallet", group: "apps", status: "done" },
  { label: "ICO List", html: "apps-crypto-ico.html", path: "/apps/crypto/ico", group: "apps", status: "done" },
  { label: "KYC", html: "apps-crypto-kyc.html", path: "/apps/crypto/kyc", group: "apps", status: "done" },

  // NFT
  { label: "Marketplace", html: "apps-nft-marketplace.html", path: "/apps/nft/marketplace", group: "apps", status: "done" },
  { label: "Explore", html: "apps-nft-explore.html", path: "/apps/nft/explore", group: "apps", status: "done" },
  { label: "Auction", html: "apps-nft-auction.html", path: "/apps/nft/auction", group: "apps", status: "done" },
  { label: "Item Details", html: "apps-nft-item-details.html", path: "/apps/nft/item-details", group: "apps", status: "done" },
  { label: "Collections", html: "apps-nft-collections.html", path: "/apps/nft/collections", group: "apps", status: "done" },
  { label: "Creators", html: "apps-nft-creators.html", path: "/apps/nft/creators", group: "apps", status: "done" },
  { label: "Ranking", html: "apps-nft-ranking.html", path: "/apps/nft/ranking", group: "apps", status: "done" },
  { label: "NFT Wallet", html: "apps-nft-wallet.html", path: "/apps/nft/wallet", group: "apps", status: "done" },
  { label: "Create NFT", html: "apps-nft-create.html", path: "/apps/nft/create", group: "apps", status: "done" },

  // Misc apps
  { label: "File Manager", html: "apps-file-manager.html", path: "/apps/file-manager", group: "apps", status: "done" },
  { label: "To Do", html: "apps-todo.html", path: "/apps/todo", group: "apps", status: "done" },
  { label: "API Key", html: "apps-api-key.html", path: "/apps/api-key", group: "apps", status: "done" },

  // Jobs
  { label: "Job Statistics", html: "apps-job-statistics.html", path: "/apps/jobs/statistics", group: "apps", status: "done" },
  { label: "Job List", html: "apps-job-lists.html", path: "/apps/jobs/list", group: "apps", status: "done" },
  { label: "Job Grid", html: "apps-job-grid-lists.html", path: "/apps/jobs/grid", group: "apps", status: "done" },
  { label: "Job Overview", html: "apps-job-details.html", path: "/apps/jobs/overview", group: "apps", status: "done" },
  { label: "Candidates List", html: "apps-job-candidate-lists.html", path: "/apps/jobs/candidates/list", group: "apps", status: "done" },
  { label: "Candidates Grid", html: "apps-job-candidate-grid.html", path: "/apps/jobs/candidates/grid", group: "apps", status: "done" },
  { label: "Application", html: "apps-job-application.html", path: "/apps/jobs/application", group: "apps", status: "done" },
  { label: "New Job", html: "apps-job-new.html", path: "/apps/jobs/new", group: "apps", status: "done" },
  { label: "Companies", html: "apps-job-companies-lists.html", path: "/apps/jobs/companies", group: "apps", status: "done" },
  { label: "Categories", html: "apps-job-categories.html", path: "/apps/jobs/categories", group: "apps", status: "done" },

  // Auth (basic set)
  { label: "Sign In Basic", html: "auth-signin-basic.html", path: "/auth/signin", group: "auth", status: "done" },
  { label: "Sign Up Basic", html: "auth-signup-basic.html", path: "/auth/signup", group: "auth", status: "done" },
  { label: "Password Reset", html: "auth-pass-reset-basic.html", path: "/auth/reset-password", group: "auth", status: "done" },
  { label: "Lock Screen", html: "auth-lockscreen-basic.html", path: "/auth/lock-screen", group: "auth", status: "done" },
  { label: "Logout", html: "auth-logout-basic.html", path: "/auth/logout", group: "auth", status: "done" },
  { label: "404", html: "auth-404-basic.html", path: "/auth/404", group: "auth", status: "done" },
  { label: "500", html: "auth-500.html", path: "/auth/500", group: "auth", status: "done" },

  // Pages
  { label: "Starter", html: "pages-starter.html", path: "/pages/starter", group: "pages", status: "done" },
  { label: "Profile", html: "pages-profile.html", path: "/pages/profile", group: "pages", status: "done" },
  { label: "Settings", html: "pages-profile-settings.html", path: "/pages/profile/settings", group: "pages", status: "done" },
  { label: "Team", html: "pages-team.html", path: "/pages/team", group: "pages", status: "done" },
  { label: "Timeline", html: "pages-timeline.html", path: "/pages/timeline", group: "pages", status: "done" },
  { label: "FAQs", html: "pages-faqs.html", path: "/pages/faqs", group: "pages", status: "done" },
  { label: "Pricing", html: "pages-pricing.html", path: "/pages/pricing", group: "pages", status: "done" },
  { label: "Gallery", html: "pages-gallery.html", path: "/pages/gallery", group: "pages", status: "done" },
  { label: "Maintenance", html: "pages-maintenance.html", path: "/pages/maintenance", group: "pages", status: "done" },
  { label: "Coming Soon", html: "pages-coming-soon.html", path: "/pages/coming-soon", group: "pages", status: "done" },
  { label: "Sitemap", html: "pages-sitemap.html", path: "/pages/sitemap", group: "pages", status: "done" },
  { label: "Search Results", html: "pages-search-results.html", path: "/pages/search-results", group: "pages", status: "done" },
  { label: "Privacy Policy", html: "pages-privacy-policy.html", path: "/pages/privacy-policy", group: "pages", status: "done" },
  { label: "Terms", html: "pages-term-conditions.html", path: "/pages/terms", group: "pages", status: "done" },

  // Landing
  { label: "One Page", html: "landing.html", path: "/landing", group: "landing", status: "done" },
  { label: "NFT Landing", html: "nft-landing.html", path: "/landing/nft", group: "landing", status: "done" },
  { label: "Job Landing", html: "job-landing.html", path: "/landing/job", group: "landing", status: "done" },
];

export const BASE_URL = "https://themesbrand.com/velzon/html/default";
