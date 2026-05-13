interface TopPagesTableProps {
  pages: {
    path: string;
    views: number;
  }[];
}

export function TopPagesTable({
  pages,
}: TopPagesTableProps) {
  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">
              Page
            </th>

            <th className="p-4 text-left">
              Views
            </th>
          </tr>
        </thead>

        <tbody>
          {pages.map((page) => (
            <tr
              key={page.path}
              className="border-b"
            >
              <td className="p-4">
                {page.path}
              </td>

              <td className="p-4">
                {page.views}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}