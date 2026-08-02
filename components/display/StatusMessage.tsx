export default function StatusMessage({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background text-center">
      <p className="rounded-base border-2 border-border bg-secondary-background px-6 py-4 text-xl font-heading text-foreground shadow-shadow">
        {message}
      </p>
      <p className="text-sm text-foreground/60">
        Mencoba lagi secara otomatis...
      </p>
    </div>
  );
}
