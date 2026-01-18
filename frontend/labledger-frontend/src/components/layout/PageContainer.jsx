export default function PageContainer({ children }) {
  return (
    <div className="min-h-screen px-6 py-6">
      <div className="max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  );
}
