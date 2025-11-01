interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function TabButton({
  label,
  isActive,
  onClick,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`tab-button ${isActive ? "active" : ""}`}
    >
      {label}
    </button>
  );
}
