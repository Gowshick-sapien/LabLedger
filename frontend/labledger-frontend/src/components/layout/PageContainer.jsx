export default function PageContainer({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-4">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}
