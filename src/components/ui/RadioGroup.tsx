export function RadioGroup({ children }: any) {
  return <div>{children}</div>;
}

export function RadioGroupItem(props: any) {
  return <input type="radio" {...props} />;
}
