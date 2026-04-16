export function Input(props: any) {
  return (
    <input
      {...props}
      style={{
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        width: '100%'
      }}
    />
  );
}
