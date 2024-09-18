export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1100px] mx-auto mt-20 bg-white min-h-screen flex flex-col">
      {children}
    </div>
  );
}
