const pages = [
  {
    path: "/themesbrand/skote-25867",
    active: "99",
    users: "25.3%",
  },
  {
    path: "/dashonic/skote-25867",
    active: "85",
    users: "21.7%",
  },
  {
    path: "/steex/skote-25867",
    active: "64",
    users: "16.3%",
  },
  {
    path: "/hybrix/skote-25867",
    active: "62",
    users: "15.8%",
  },
  {
    path: "/themesbrand/skote-25867",
    active: "51",
    users: "13.0%",
  },
  {
    path: "/velzon/skote-25867",
    active: "30",
    users: "7.6%",
  },
];

export default function TopPages() {
  return (
    <div className="card h-full">
      <div className="card-header">
        <h5 className="card-title">Top Pages</h5>
        <button
          type="button"
          className="cursor-pointer rounded border border-[#e9ebec] bg-white px-2.5 py-1 text-[12px] font-medium text-[#405189] hover:bg-[#f3f6f9]"
        >
          See All
        </button>
      </div>
      <div className="card-body !p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                <th className="px-5 py-3 font-medium">Active Page</th>
                <th className="px-3 py-3 font-medium">Active</th>
                <th className="px-5 py-3 font-medium">Users</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page, i) => (
                <tr
                  key={`${page.path}-${i}`}
                  className="border-b border-[#e9ebec] last:border-0"
                >
                  <td className="px-5 py-3">
                    <a
                      href="#"
                      className="text-[#405189] no-underline hover:underline"
                    >
                      {page.path}
                    </a>
                  </td>
                  <td className="px-3 py-3 font-medium text-[#495057]">
                    {page.active}
                  </td>
                  <td className="px-5 py-3 text-[#495057]">{page.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
