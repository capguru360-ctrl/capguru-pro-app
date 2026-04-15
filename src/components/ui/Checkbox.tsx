export function Checkbox({ checked, onChange }: any) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ width: "18px", height: "18px" }}
    />
  );
}
