// Vector maple leaf (traced from the project's maple.png) — inherits currentColor.
export default function MapleMark({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M255 2l48 74 57-22-18 118 66-57 5 50 82-18-27 90 44 20-127 98 12 58-126-20v119h-30V393l-127 20 13-58L0 257l45-20-28-90 83 18 4-50 65 57-17-118 56 22z" />
    </svg>
  );
}
