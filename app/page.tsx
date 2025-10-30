async function getDrawData() {
  const res = await fetch("http://localhost:3000/api/draws", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const data = await getDrawData();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold text-blue-600">Hello Tailwind!</h1>
      <h1 className="text-3xl font-bold mb-4">Latest Immigration Draw</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>
          <strong>Program:</strong> {data.program}
        </p>
        <p>
          <strong>CRS Cutoff:</strong> {data.crs_cutoff}
        </p>
        <p>
          <strong>Invitations:</strong> {data.invitations}
        </p>
        <p>
          <strong>Date:</strong> {data.draw_date}
        </p>
      </div>
    </main>
  );
}
