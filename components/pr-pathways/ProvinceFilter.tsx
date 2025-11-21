import styles from "./PRPathways.module.css";

interface ProvinceFilterProps {
  provinces: string[];
  value: string;
  onChange: (value: string) => void;
}

export function ProvinceFilter({
  provinces,
  value,
  onChange,
}: ProvinceFilterProps) {
  return (
    <div className={styles.filterSection}>
      <label className={styles.filterLabel}>Filter by Province</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.filterSelect}
      >
        {provinces.map((prov) => (
          <option key={prov} value={prov}>
            {prov}
          </option>
        ))}
      </select>
    </div>
  );
}
