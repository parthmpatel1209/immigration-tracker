export async function GET() {
  const draws = [
    {
      round: 312,
      program: "Express Entry - CEC",
      crs_cutoff: 505,
      invitations: 3200,
      draw_date: "2025-10-29",
    },
    {
      round: 311,
      program: "Express Entry - FSW",
      crs_cutoff: 480,
      invitations: 3500,
      draw_date: "2025-09-15",
    },
    {
      round: 310,
      program: "PNP",
      crs_cutoff: 700,
      invitations: 500,
      draw_date: "2025-08-20",
    },
  ];

  return new Response(JSON.stringify(draws), {
    headers: { "Content-Type": "application/json" },
  });
}
