ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
UPDATE public.mentors SET approval_status = 'approved' WHERE user_id IS NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS admin_review_status text NOT NULL DEFAULT 'unreviewed';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS admin_notes text NOT NULL DEFAULT '';

CREATE OR REPLACE FUNCTION public.validate_admin_fields()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_TABLE_NAME = 'mentors' THEN
    IF NEW.approval_status NOT IN ('pending','approved','rejected') THEN RAISE EXCEPTION 'invalid approval_status'; END IF;
    IF (TG_OP = 'INSERT' OR NEW.approval_status IS DISTINCT FROM OLD.approval_status)
       AND NOT public.has_role(auth.uid(),'admin') AND auth.uid() IS NOT NULL THEN
      IF TG_OP = 'INSERT' THEN NEW.approval_status := 'pending'; ELSE NEW.approval_status := OLD.approval_status; END IF;
    END IF;
  ELSE
    IF NEW.admin_review_status NOT IN ('unreviewed','approved','flagged') THEN RAISE EXCEPTION 'invalid review status'; END IF;
    IF (NEW.admin_review_status IS DISTINCT FROM OLD.admin_review_status OR NEW.admin_notes IS DISTINCT FROM OLD.admin_notes)
       AND NOT public.has_role(auth.uid(),'admin') THEN
      NEW.admin_review_status := OLD.admin_review_status; NEW.admin_notes := OLD.admin_notes;
    END IF;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS mentors_admin_guard ON public.mentors;
CREATE TRIGGER mentors_admin_guard BEFORE INSERT OR UPDATE ON public.mentors FOR EACH ROW EXECUTE FUNCTION public.validate_admin_fields();
DROP TRIGGER IF EXISTS bookings_admin_guard ON public.bookings;
CREATE TRIGGER bookings_admin_guard BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.validate_admin_fields();

CREATE POLICY "admin update mentors" ON public.mentors FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin read bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin read invoices" ON public.invoices FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin read evals" ON public.session_evaluations FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin read roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));