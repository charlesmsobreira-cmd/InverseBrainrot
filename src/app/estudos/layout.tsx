export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

