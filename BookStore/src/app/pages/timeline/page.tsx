import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Timeline | Velzon - Admin Dashboard",
};

const events = [
  {
    date: "28 Dec",
    title: "Joined Themesbrand",
    desc: "Started as Product Designer in the Velzon team.",
    color: "#405189",
  },
  {
    date: "15 Jan",
    title: "First major release",
    desc: "Shipped Velzon v1.0 with 25+ apps and components.",
    color: "#0ab39c",
  },
  {
    date: "02 Mar",
    title: "NFT landing launched",
    desc: "Published NFT marketplace landing for digital creators.",
    color: "#f7b84b",
  },
  {
    date: "20 Apr",
    title: "CRM dashboard update",
    desc: "Added deals pipeline and leads analytics widgets.",
    color: "#299cdb",
  },
  {
    date: "10 Jun",
    title: "Community milestone",
    desc: "Reached 10k+ downloads across Themesbrand stores.",
    color: "#f06548",
  },
];

export default function TimelinePage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Timeline"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Timeline" },
        ]}
      />
      <div className="card">
        <div className="card-body">
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute top-0 bottom-0 left-[19px] w-0.5 bg-[#e9ebec] md:left-1/2 md:-translate-x-px" />
            <ul className="m-0 list-none space-y-8 p-0">
              {events.map((e, i) => (
                <li
                  key={e.title}
                  className={`relative flex flex-col md:w-1/2 ${
                    i % 2 === 0
                      ? "md:ml-0 md:pr-10 md:text-right"
                      : "md:ml-auto md:pl-10"
                  }`}
                >
                  <span
                    className="absolute top-1 left-[14px] z-10 h-3 w-3 rounded-full border-2 border-white md:left-auto"
                    style={{
                      background: e.color,
                      ...(i % 2 === 0
                        ? { right: "-6.5px" }
                        : { left: "-6.5px" }),
                    }}
                  />
                  <span className="mb-1 pl-10 text-[11px] font-semibold tracking-wide text-[#878a99] uppercase md:pl-0">
                    {e.date}
                  </span>
                  <div className="ml-10 rounded border border-[#e9ebec] bg-[#f3f3f9] p-4 md:ml-0">
                    <h6 className="m-0 text-[14px] font-semibold text-[#495057]">
                      {e.title}
                    </h6>
                    <p className="mt-1 mb-0 text-[13px] text-[#878a99]">{e.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
