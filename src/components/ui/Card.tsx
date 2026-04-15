export default function Card({ children }: any) {
  return (
    <div style={{
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      background: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {children}
    </div>
  );
}
