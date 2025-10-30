interface DrawCardProps {
  draw: {
    program: string;
    crs_cutoff: number;
    invitations: number;
    draw_date: string;
    draw_province?: string;
  };
}

export default function DrawCard({ draw }: DrawCardProps) {
  return (
    <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border text-center max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">
        Latest Draw — {draw.program}
      </h2>
      <p className="text-gray-700">
        <strong>CRS Cutoff:</strong> {draw.crs_cutoff}
      </p>
      <p className="text-gray-700">
        <strong>Invitations:</strong> {draw.invitations}
      </p>
      <p className="text-gray-700">
        <strong>Date:</strong>{" "}
        {new Date(draw.draw_date).toLocaleDateString("en-CA")}
      </p>
      {draw.draw_province && (
        <p className="text-gray-700">
          <strong>Province:</strong> {draw.draw_province}
        </p>
      )}
    </div>
  );
}
