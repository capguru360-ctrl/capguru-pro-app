export function Label({ children, ...props }: any) {
  return (
    <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }} {...props}>
      {children}
    </label>
  );
}
