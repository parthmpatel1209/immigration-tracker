interface Draw {
  id: number;
  round: number;
  program: string;
  crs_cutoff: number;
  invitations: number;
  draw_date: string;
  draw_province?: string;
}

interface DrawTableProps {
  draws: Draw[];
}

export default function DrawTable({ draws }: DrawTableProps) {
  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full border-collapse border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Round</th>
            <th className="p-2 border">Program</th>
            <th className="p-2 border">CRS Cutoff</th>
            <th className="p-2 border">Invitations</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Province</th>
          </tr>
        </thead>
        <tbody>
          {draws.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50">
              <td className="p-2 border text-center">{d.round}</td>
              <td className="p-2 border">{d.program}</td>
              <td className="p-2 border text-center">{d.crs_cutoff}</td>
              <td className="p-2 border text-center">{d.invitations}</td>
              <td className="p-2 border text-center">
                {new Date(d.draw_date).toLocaleDateString("en-CA")}
              </td>
              <td className="p-2 border text-center">
                {d.draw_province || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
