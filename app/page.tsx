import Tabs from "@/components/Tabs";
import DrawsTable from "@/components/DrawsTable";
import LatestDraw from "@/components/LatestDraw";
import ImmigrationNews from "@/components/ImmigrationNews";
import PRPathways from "@/components/PRPathways";
//import DarkModeToggle from "@/components/DarkModeToggle";

export default function HomePage() {
  const tabs = [
    { label: "Latest Draws", content: <LatestDraw /> },
    { label: "CRS Scores", content: <DrawsTable /> },
    { label: "Immigration News", content: <ImmigrationNews /> },
    { label: "PR Pathways by Province", content: <PRPathways /> },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Canadian Immigration Tracker</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}
