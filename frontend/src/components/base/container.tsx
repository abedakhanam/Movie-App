export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className=" mx-auto bg-secondary min-h-screen flex flex-col">
      {children}
    </div>
  );
}
