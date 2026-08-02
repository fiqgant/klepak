export default function EmergencyOverlay({ text }: { text: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-klepak-alert px-12 text-center">
      <p className="text-2xl font-bold uppercase tracking-widest text-white/90">
        Pengumuman Darurat
      </p>
      <p className="max-w-5xl text-4xl font-bold leading-tight text-white sm:text-6xl">
        {text}
      </p>
    </div>
  );
}
