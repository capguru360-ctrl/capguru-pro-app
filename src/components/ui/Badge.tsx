export function Badge({ children }: any) {
  return (
    <span
      style={{
        padding: '6px 12px',
        borderRadius: '999px',
        backgroundColor: '#EEF2FF',
        color: '#3730A3',
        fontWeight: 'bold',
        fontSize: '12px'
      }}
    >
      {children}
    </span>
  );
}
