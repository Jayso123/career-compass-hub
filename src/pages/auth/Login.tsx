import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({ email: z.string().trim().email().max(255), password: z.string().min(6).max(128) });

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return toast.error("Enter a valid email and password (min 6 chars).");
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    if (error || !data.user) { setBusy(false); return toast.error(error?.message ?? "Sign-in failed"); }
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const roles = (r ?? []).map((x) => x.role);
    setBusy(false);
    const dest = roles.includes("admin") ? "/admin/dashboard" : roles.includes("mentor") ? "/mentor/dashboard" : "/candidate/dashboard";
    navigate(from ?? dest, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <form onSubmit={submit} className="card-elevated w-full max-w-md p-8 space-y-5">
        <div>
          <Link to="/" className="font-display font-bold text-xl text-primary">Career Boost Hub</Link>
          <h1 className="font-display text-2xl font-bold mt-4">Sign in to your account</h1>
          <p className="text-sm text-muted-foreground">Candidates, mentors and administrators sign in here.</p>
        </div>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" variant="accent" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in →"}</Button>
      </form>
    </div>
  );
};
export default Login;
