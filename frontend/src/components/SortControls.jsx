export default function SortControls({ fields, value, onChange }) {
  return (
    <div className="sort-controls">
      <select value={value.sortBy} onChange={(e) => onChange({ ...value, sortBy: e.target.value })}>
        {fields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
      <select
        value={value.sortOrder}
        onChange={(e) => onChange({ ...value, sortOrder: e.target.value })}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
