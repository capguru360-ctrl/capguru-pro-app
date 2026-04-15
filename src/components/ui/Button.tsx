export function Button({ children }) {
  return (
    <Button style={{
      padding: "10px 20px",
      background: "#2563eb",
      color: "white",
      borderRadius: "8px",
      border: "none"
    }}>
      {children}
    </Button>
  );
}
