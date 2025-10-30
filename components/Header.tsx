//top title bar
export default function Header() {
  return (
    <header className="p-6 bg-white shadow-md text-center border-b">
      <h1 className="text-3xl font-bold text-gray-800">
        Canada Express Entry Tracker 🇨🇦
      </h1>
      <p className="text-gray-500 mt-2">
        Live updates on CRS scores and immigration draws
      </p>
    </header>
  );
}
