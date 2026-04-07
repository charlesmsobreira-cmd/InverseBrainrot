import StudyTimer from '@/components/StudyTimer';

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <StudyTimer />
      {children}
    </div>
  );
}
