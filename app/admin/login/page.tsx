"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (signInError) {
      setError("Email atau kata sandi salah.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-main px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow"
      >
        <h1 className="mb-1 font-heading text-2xl text-foreground">Klepak</h1>
        <p className="mb-6 text-sm text-foreground/60">Admin login</p>

        <Label className="mb-1 block">Email</Label>
        <Input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />

        <Label className="mb-1 block">Kata sandi</Label>
        <Input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />

        {error && (
          <p className="mb-4 rounded-base border-2 border-border bg-destructive px-3 py-2 text-sm font-base text-destructive-foreground">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Masuk..." : "Masuk"}
        </Button>
      </form>
    </main>
  );
}
