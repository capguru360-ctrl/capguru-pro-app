import React from 'react';

export function Card({ children }: any) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "10px" }}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: any) {
  return (
    <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: any) {
  return (
    <h3 style={{ fontSize: "18px", marginBottom: "5px" }}>
      {children}
    </h3>
  );
}

export function CardContent({ children }: any) {
  return (
    <div style={{ marginTop: "10px" }}>
      {children}
    </div>
  );
}
