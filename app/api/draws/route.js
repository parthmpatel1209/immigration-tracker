export async function GET() {
  const data = {
    round: 312,
    program: "Express Entry - CEC",
    crs_cutoff: 505,
    invitations: 3200,
    draw_date: "2025-10-29",
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
