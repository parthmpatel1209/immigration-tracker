// lib/clb-tables.ts
// Official IRCC language-test → CLB/NCLC equivalency (CLB 4–10).
// Source: canada.ca › Express Entry › Language testing (verified 2026-10-17).
// Rows use the same shape the app previously read from the `language_benchmarks`
// table so the calculator and CLB chart modal keep working unchanged.

export interface BenchmarkRow {
  test_name: string;
  clb_level: number;
  listening: string;
  reading: string;
  writing: string;
  speaking: string;
}

type Cells = [string, string, string, string]; // listening, reading, writing, speaking

const table = (test_name: string, rows: Record<number, Cells>): BenchmarkRow[] =>
  Object.entries(rows).map(([clb, [listening, reading, writing, speaking]]) => ({
    test_name,
    clb_level: Number(clb),
    listening,
    reading,
    writing,
    speaking,
  }));

export const OFFICIAL_BENCHMARKS: BenchmarkRow[] = [
  ...table("IELTS General Training", {
    10: ["8.5–9.0", "8.0–9.0", "7.5–9.0", "7.5–9.0"],
    9: ["8.0", "7.0", "7.0", "7.0"],
    8: ["7.5", "6.5", "6.5", "6.5"],
    7: ["6.0", "6.0", "6.0", "6.0"],
    6: ["5.5", "5.0", "5.5", "5.5"],
    5: ["5.0", "4.0", "5.0", "5.0"],
    4: ["4.5", "3.5", "4.0", "4.0"],
  }),
  ...table("CELPIP-General", {
    10: ["10", "10", "10", "10"],
    9: ["9", "9", "9", "9"],
    8: ["8", "8", "8", "8"],
    7: ["7", "7", "7", "7"],
    6: ["6", "6", "6", "6"],
    5: ["5", "5", "5", "5"],
    4: ["4", "4", "4", "4"],
  }),
  ...table("PTE-Core", {
    10: ["89–90", "88–90", "90", "89–90"],
    9: ["82–88", "78–87", "88–89", "84–88"],
    8: ["71–81", "69–77", "79–87", "76–83"],
    7: ["60–70", "60–68", "69–78", "68–75"],
    6: ["50–59", "51–59", "60–68", "59–67"],
    5: ["39–49", "42–50", "51–59", "51–58"],
    4: ["28–38", "33–41", "41–50", "42–50"],
  }),
  ...table("TEF Canada", {
    10: ["316–360", "263–300", "393–450", "393–450"],
    9: ["298–315", "248–262", "371–392", "371–392"],
    8: ["280–297", "233–247", "349–370", "349–370"],
    7: ["249–279", "207–232", "310–348", "310–348"],
    6: ["217–248", "181–206", "271–309", "271–309"],
    5: ["181–216", "151–180", "226–270", "226–270"],
    4: ["145–180", "121–150", "181–225", "181–225"],
  }),
  ...table("TCF Canada", {
    10: ["549–699", "549–699", "16–20", "16–20"],
    9: ["523–548", "524–548", "14–15", "14–15"],
    8: ["503–522", "499–523", "12–13", "12–13"],
    7: ["458–502", "453–498", "10–11", "10–11"],
    6: ["398–457", "406–452", "7–9", "7–9"],
    5: ["369–397", "375–405", "6", "6"],
    4: ["331–368", "342–374", "4–5", "4–5"],
  }),
];
