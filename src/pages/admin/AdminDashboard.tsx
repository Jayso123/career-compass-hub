import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ShieldCheck, Users, CalendarCheck, FileText, LogOut, Download } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Mentor = Tables<"mentors">;
type Booking = Tables<"bookings"> & { mentors: { name: string } | null; mentorship_tiers: { name: string } | null };
type Invoice = Tables<"invoices"> & { bookings: { ref: string; candidate_id: string; mentors: { name: string } | null; mentorship_tiers: { name: string } | null } | null };
type Eval = Tables<"session_evaluations">;
type Feedback = Tables<"feedback">;

const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const downloadInvoice = (inv: Invoice, candidate: string) => {
  const w = window.open("", "_blank");
  if (!w) return toast.error("Allow pop-ups to download the invoice.");
  w.document.write(`<html><head><title>${inv.invoice_no}</title><style>body{font-family:sans-serif;padding:40px;color:#0f2340}td{padding:6px 12px;border-bottom:1px solid #ddd}</style></head><body>
  <h2>Career Boost Hub — Tax Invoice</h2><p>Invoice: <b>${inv.invoice_no}</b><br/>Booking: ${inv.bookings?.ref ?? ""}<br/>Date: ${new Date(inv.issued_at).toLocaleDateString("en-IN")}<br/>SAC: ${inv.sac_code}</p>
  <table><tr><td>Candidate</td><td>${candidate}</td></tr><tr><td>Mentor</td><td>${inv.bookings?.mentors?.name ?? ""}</td></tr><tr><td>Service</td><td>${inv.bookings?.mentorship_tiers?.name ?? ""}</td></tr>
  <tr><td>Base amount</td><td>${inr(inv.base_amount)}</td></tr><tr><td>Platform fee</td><td>${inr(inv.platform_fee)}</td></tr><tr><td>GST</td><td>${inr(inv.gst_amount)}</td></tr><tr><td><b>Total</b></td><td><b>${inr(inv.total)}</b></td></tr>
  <tr><td>Payment ref</td><td>${inv.payment_ref ?? "—"}</td></tr></table><script>window.print()</script></body></html>`);
  w.document.close();
};

const AdminDashboard = () => {
  const { signOut, session } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [evals, setEvals] = useState<Record<string, Eval>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  const load = useCallback(async () => {
    const [m, b, i, e, f, p] = await Promise.all([
      supabase.from("mentors").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*, mentors(name), mentorship_tiers(name)").order("created_at", { ascending: false }),
      supabase.from("invoices").select("*, bookings(ref, candidate_id, mentors(name), mentorship_tiers(name))").order("issued_at", { ascending: false }),
      supabase.from("session_evaluations").select("*"),
      supabase.from("feedback").select("*"),
      supabase.from("profiles").select("id, full_name, email"),
    ]);
    if (m.error || b.error || i.error) toast.error("Some admin data failed to load.");
    setMentors(m.data ?? []);
    setBookings((b.data as Booking[]) ?? []);
    setInvoices((i.data as Invoice[]) ?? []);
    setEvals(Object.fromEntries((e.data ?? []).map((x) => [x.booking_id, x])));
    setFeedback(Object.fromEntries((f.data ?? []).map((x) => [x.booking_id, x])));
    setEmails(Object.fromEntries((p.data ?? []).map((x) => [x.id, x.full_name || x.email])));
  }, []);
  useEffect(() => { load(); }, [load]);

  const reviewMentor = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("mentors").update({ approval_status: status, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Mentor ${status}`); load();
  };
  const reviewSession = async (id: string, status: "approved" | "flagged") => {
    const { error } = await supabase.from("bookings").update({ admin_review_status: status, admin_notes: (notes[id] ?? "").slice(0, 1000) }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Session ${status}`); load();
  };

  const pendingCount = mentors.filter((m) => m.approval_status === "pending").length;
  const revenue = invoices.reduce((s, i) => s + Number(i.platform_fee), 0);
  const gst = invoices.reduce((s, i) => s + Number(i.gst_amount), 0);
  const stats = [
    { icon: Users, label: "Pending mentors", value: pendingCount },
    { icon: CalendarCheck, label: "Sessions", value: bookings.length },
    { icon: FileText, label: "Invoices", value: invoices.length },
    { icon: ShieldCheck, label: "Platform fees", value: inr(revenue) },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-card border-b border-border">
        <div className="container-main flex items-center justify-between h-16">
          <Link to="/" className="font-display font-bold text-lg text-primary">CareerBoost Hub <span className="text-muted-foreground font-normal">• Admin Console</span></Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground">{session?.user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="w-4 h-4 mr-1" />Logout</Button>
          </div>
        </div>
      </header>

      <main className="container-main py-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-elevated p-5">
              <s.icon className="w-5 h-5 text-accent mb-2" />
              <div className="font-display text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="mentors">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="mentors">Mentor approvals</TabsTrigger>
            <TabsTrigger value="sessions">Session reviews</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="mentors" className="space-y-4">
            <div className="flex gap-2">
              {(["pending", "approved", "rejected"] as const).map((f) => (
                <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize">{f}</Button>
              ))}
            </div>
            {mentors.filter((m) => m.approval_status === filter).length === 0 && <p className="text-muted-foreground text-sm">No {filter} mentors.</p>}
            {mentors.filter((m) => m.approval_status === filter).map((m) => (
              <div key={m.id} className="card-elevated p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <div className="font-display font-semibold">{m.name}</div>
                  <div className="text-sm text-muted-foreground">{m.title}{m.company && ` @ ${m.company}`} • {m.domain} • {m.years_exp}+ yrs • ₹{m.hourly_rate}/hr</div>
                  <div className="flex flex-wrap gap-1 mt-2">{m.specializations.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
                </div>
                {m.approval_status !== "approved" && <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="accent" onClick={() => reviewMentor(m.id, "approved")}>Approve</Button>
                  {m.approval_status === "pending" && <Button size="sm" variant="outline" onClick={() => reviewMentor(m.id, "rejected")}>Reject</Button>}
                </div>}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            {bookings.length === 0 && <p className="text-muted-foreground text-sm">No sessions yet.</p>}
            {bookings.map((b) => {
              const ev = evals[b.id]; const fb = feedback[b.id];
              return (
                <div key={b.id} className="card-elevated p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="font-display font-semibold">Session #{b.ref} • {b.mentorship_tiers?.name} • {inr(b.amount_inr)}</div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{b.status.replace("_", " ")}</Badge>
                      <Badge variant="outline">Escrow: {b.escrow}</Badge>
                      <Badge variant={b.admin_review_status === "flagged" ? "destructive" : "secondary"}>{b.admin_review_status}</Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Candidate: {emails[b.candidate_id] ?? "—"} • Mentor: {b.mentors?.name} • Sign-off: candidate {b.candidate_signoff ? "✓" : "✗"} / mentor {b.mentor_signoff ? "✓" : "✗"}</div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-secondary p-3">{ev ? <>Rubric — DSA {ev.problem_solving}/5 • Arch {ev.system_architecture}/5 • Comm {ev.communication}/5</> : "No mentor evaluation yet"}</div>
                    <div className="rounded-lg bg-secondary p-3">{fb ? <>{fb.rating}★ — "{fb.comment}"</> : "No candidate feedback yet"}</div>
                  </div>
                  <Textarea placeholder="Admin notes" maxLength={1000} defaultValue={b.admin_notes} onChange={(e) => setNotes({ ...notes, [b.id]: e.target.value })} />
                  <div className="flex gap-2">
                    <Button size="sm" variant="accent" onClick={() => reviewSession(b.id, "approved")}>Mark reviewed</Button>
                    <Button size="sm" variant="outline" onClick={() => reviewSession(b.id, "flagged")}>Flag</Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <div className="text-sm text-muted-foreground">Total GST collected: <b className="text-foreground">{inr(gst)}</b> • SAC 998311</div>
            {invoices.length === 0 && <p className="text-muted-foreground text-sm">No invoices issued yet.</p>}
            <div className="card-elevated overflow-x-auto">
              {invoices.length > 0 && <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground border-b border-border">{["Invoice", "Booking", "Candidate", "Mentor", "Total", "GST", "Date", ""].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
                <tbody>{invoices.map((i) => (
                  <tr key={i.id} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium">{i.invoice_no}</td><td className="p-3">{i.bookings?.ref}</td>
                    <td className="p-3">{emails[i.bookings?.candidate_id ?? ""] ?? "—"}</td><td className="p-3">{i.bookings?.mentors?.name}</td>
                    <td className="p-3">{inr(i.total)}</td><td className="p-3">{inr(i.gst_amount)}</td>
                    <td className="p-3">{new Date(i.issued_at).toLocaleDateString("en-IN")}</td>
                    <td className="p-3"><Button size="sm" variant="ghost" onClick={() => downloadInvoice(i, emails[i.bookings?.candidate_id ?? ""] ?? "")}><Download className="w-4 h-4" /></Button></td>
                  </tr>))}</tbody>
              </table>}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
export default AdminDashboard;
