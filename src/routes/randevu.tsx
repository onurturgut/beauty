"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { servicesQuery, staffQuery, settingsQuery } from "@/lib/data";
import { media } from "@/lib/media";
import {
  formatDateTR,
  formatDuration,
  formatTRY,
  formatTimeTR,
  istanbulDateKey,
  mapBookingError,
} from "@/lib/format";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const STEPS = ["Hizmet", "Uzman", "Tarih", "Saat", "Bilgiler", "Onay"];
type Slot = {
  slot: string;
  starts_at: string;
  available: boolean;
  staff_id: string | null;
};

export function BookingPage() {
  const params = useSearchParams();
  const search = {
    hizmet: params.get("hizmet") ?? undefined,
    uzman: params.get("uzman") ?? undefined,
  };
  const qc = useQueryClient();
  const { data: services = [] } = useQuery(servicesQuery);
  const { data: staff = [] } = useQuery(staffQuery);
  const { data: settings } = useQuery(settingsQuery);

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(
    search.hizmet ?? null,
  );
  const [staffId, setStaffId] = useState<string | null>(search.uzman ?? null);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({
    first: "",
    last: "",
    phone: "",
    email: "",
    note: "",
    kvkk: false,
    marketing: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    reference: string;
    staff_name: string;
    starts_at: string;
  } | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search.hizmet) setStep(search.uzman ? 2 : 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const service = services.find((s) => s.id === serviceId);
  const eligibleStaff = staff.filter((m) =>
    m.staff_services.some((x) => x.service_id === serviceId),
  );
  const chosenStaff = staff.find((m) => m.id === (slot?.staff_id ?? staffId));

  const go = (n: number) => {
    setError(null);
    ensureGsap();
    if (!panel.current || prefersReducedMotion()) return setStep(n);
    const dir = n > step ? 1 : -1;
    gsap.to(panel.current, {
      autoAlpha: 0,
      x: -24 * dir,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setStep(n);
        requestAnimationFrame(() =>
          gsap.fromTo(
            panel.current,
            { autoAlpha: 0, x: 24 * dir },
            { autoAlpha: 1, x: 0, duration: 0.3, ease: "power3.out" },
          ),
        );
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const weekdays = useQuery({
    queryKey: ["open-weekdays", serviceId, staffId],
    enabled: !!serviceId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_open_weekdays", {
        _service: serviceId!,
        _staff: staffId ?? undefined,
      } as never);
      if (error) throw error;
      return (data ?? []) as number[];
    },
  });

  const slots = useQuery({
    queryKey: ["availability", serviceId, staffId, day],
    enabled: !!serviceId && !!day,
    refetchInterval: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_availability", {
        _service: serviceId!,
        _staff: staffId ?? undefined,
        _day: day!,
      } as never);
      if (error) throw error;
      return (data ?? []) as Slot[];
    },
  });

  const submit = async () => {
    if (!service || !slot) return;
    setSubmitting(true);
    setError(null);
    const { data, error } = await supabase.rpc("create_booking", {
      _service: service.id,
      _staff: staffId ?? undefined,
      _starts_at: slot.starts_at,
      _first: form.first,
      _last: form.last,
      _phone: form.phone,
      _email: form.email,
      _note: form.note,
      _marketing: form.marketing,
      _kvkk: form.kvkk,
    } as never);
    setSubmitting(false);
    if (error || !data?.[0]) {
      const msg = mapBookingError(error?.message ?? "");
      setError(msg ?? "Randevu oluşturulamadı. Lütfen tekrar deneyin.");
      if (error?.message.includes("SLOT_TAKEN")) {
        setSlot(null);
        qc.invalidateQueries({ queryKey: ["availability"] });
        setTimeout(() => go(3), 1600);
      }
      return;
    }
    setResult(data[0]);
  };

  if (result && service)
    return <Success result={result} serviceName={service.name} />;

  const phoneOk =
    /^(\+?90)?0?5\d{9}$/.test(
      form.phone.replace(/\D/g, "").replace(/^(90)/, ""),
    ) || /^0?5\d{9}$/.test(form.phone.replace(/\D/g, ""));
  const infoOk =
    form.first.trim().length >= 2 &&
    form.last.trim().length >= 2 &&
    phoneOk &&
    form.kvkk;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-24 pt-32">
        <div className="container-lux grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <p className="eyebrow mb-6 text-accent">Online Randevu</p>
            <h1 className="display-section text-espresso">
              Güzelliğine
              <br />
              <em>zaman ayır.</em>
            </h1>
            <ol className="mt-10 hidden space-y-3 lg:block">
              {STEPS.map((s, i) => (
                <li
                  key={s}
                  className={cn(
                    "flex items-center gap-4 text-sm",
                    i === step
                      ? "text-espresso"
                      : i < step
                        ? "text-muted-foreground"
                        : "text-muted-foreground/50",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-full border text-xs",
                      i === step &&
                        "border-accent bg-accent text-accent-foreground",
                      i < step && "border-espresso/30",
                    )}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            {service && (
              <div className="mt-10 hidden space-y-1 border-t pt-6 text-sm text-muted-foreground lg:block">
                <p className="font-display text-2xl text-espresso">
                  {service.name}
                </p>
                <p>
                  {formatDuration(service.duration_min)}
                  {service.price != null && ` · ${formatTRY(service.price)}`}
                </p>
                {chosenStaff && <p>{chosenStaff.full_name}</p>}
                {day && (
                  <p>
                    {formatDateTR(day + "T12:00:00")}
                    {slot && ` · ${slot.slot}`}
                  </p>
                )}
              </div>
            )}
          </aside>

          <section className="lg:col-span-8" aria-live="polite">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <span className="eyebrow text-muted-foreground">
                Adım {step + 1} / {STEPS.length}
              </span>
              <span className="eyebrow text-espresso">{STEPS[step]}</span>
            </div>
            <div className="mb-8 h-px w-full bg-border">
              <div
                className="h-px bg-accent transition-all duration-500"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>

            <div ref={panel}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-espresso"
                >
                  <ArrowLeft className="h-4 w-4" /> Geri
                </button>
              )}

              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setServiceId(s.id);
                        setSlot(null);
                        setStaffId(null);
                        go(1);
                      }}
                      className={cn(
                        "group flex gap-4 border bg-card p-3 text-left transition-colors hover:border-accent",
                        serviceId === s.id && "border-accent",
                      )}
                    >
                      <img
                        src={media(s.image_key)}
                        alt=""
                        className="h-28 w-24 shrink-0 object-cover"
                        loading="lazy"
                      />
                      <div className="flex flex-col py-1">
                        <span className="eyebrow text-muted-foreground">
                          {s.category?.name}
                        </span>
                        <span className="mt-1 font-display text-2xl text-espresso">
                          {s.name}
                        </span>
                        <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {s.description}
                        </span>
                        <span className="mt-auto pt-2 text-xs text-espresso">
                          {formatDuration(s.duration_min)}
                          {s.price != null && ` · ${formatTRY(s.price)}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStaffId(null);
                      setSlot(null);
                      go(2);
                    }}
                    className={cn(
                      "flex min-h-36 flex-col justify-center border bg-card p-6 text-left hover:border-accent",
                      staffId === null && "border-accent",
                    )}
                  >
                    <Sparkles className="mb-3 h-5 w-5 text-accent" />
                    <span className="font-display text-2xl text-espresso">
                      Fark etmez
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Müsait bir uzman seçilsin
                    </span>
                  </button>
                  {eligibleStaff.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setStaffId(m.id);
                        setSlot(null);
                        go(2);
                      }}
                      className={cn(
                        "flex items-center gap-4 border bg-card p-3 text-left hover:border-accent",
                        staffId === m.id && "border-accent",
                      )}
                    >
                      <img
                        src={media(m.photo_key)}
                        alt=""
                        className="h-28 w-24 object-cover"
                        loading="lazy"
                      />
                      <div>
                        <span className="block font-display text-2xl text-espresso">
                          {m.full_name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {m.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <MonthCalendar
                  openWeekdays={weekdays.data ?? []}
                  closed={settings?.closed_dates ?? []}
                  maxDays={settings?.max_advance_days ?? 60}
                  value={day}
                  onChange={(d) => {
                    setDay(d);
                    setSlot(null);
                    go(3);
                  }}
                />
              )}

              {step === 3 && (
                <div>
                  <p className="mb-6 font-display text-3xl text-espresso">
                    {day && formatDateTR(day + "T12:00:00")}
                  </p>
                  {slots.isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Müsaitlik
                      kontrol ediliyor…
                    </div>
                  ) : !slots.data?.length ? (
                    <p className="text-muted-foreground">
                      Bu gün için uygun saat bulunmuyor. Lütfen başka bir gün
                      seçin.
                    </p>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                        {slots.data.map((s) => {
                          const selected = slot?.starts_at === s.starts_at;
                          return (
                            <button
                              key={s.starts_at}
                              type="button"
                              disabled={!s.available}
                              onClick={() => setSlot(s)}
                              aria-pressed={selected}
                              className={cn(
                                "relative flex min-h-14 flex-col items-center justify-center border text-sm transition-all",
                                s.available &&
                                  !selected &&
                                  "bg-card text-espresso hover:border-accent",
                                selected &&
                                  "border-accent bg-accent text-accent-foreground",
                                !s.available &&
                                  "cursor-not-allowed border-dashed bg-transparent text-muted-foreground/50 line-through",
                              )}
                            >
                              {s.slot}
                              {!s.available && (
                                <span className="text-[0.6rem] uppercase tracking-widest no-underline">
                                  Dolu
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-8 flex justify-end">
                        <Button
                          variant="lux"
                          size="xl"
                          disabled={!slot}
                          onClick={() => go(4)}
                        >
                          Devam Et
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 4 && (
                <form
                  className="grid gap-5 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (infoOk) go(5);
                  }}
                >
                  <Field label="Ad *">
                    <Input
                      required
                      maxLength={60}
                      value={form.first}
                      onChange={(e) =>
                        setForm({ ...form, first: e.target.value })
                      }
                      autoComplete="given-name"
                      className="h-12"
                    />
                  </Field>
                  <Field label="Soyad *">
                    <Input
                      required
                      maxLength={60}
                      value={form.last}
                      onChange={(e) =>
                        setForm({ ...form, last: e.target.value })
                      }
                      autoComplete="family-name"
                      className="h-12"
                    />
                  </Field>
                  <Field label="Telefon *">
                    <Input
                      required
                      type="tel"
                      inputMode="tel"
                      placeholder="05XX XXX XX XX"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      autoComplete="tel"
                      className="h-12"
                    />
                  </Field>
                  <Field label="E-posta (opsiyonel)">
                    <Input
                      type="email"
                      maxLength={255}
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      autoComplete="email"
                      className="h-12"
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Randevu notu (opsiyonel)">
                      <Textarea
                        maxLength={500}
                        value={form.note}
                        onChange={(e) =>
                          setForm({ ...form, note: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <div className="space-y-4 sm:col-span-2">
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox
                        checked={form.kvkk}
                        onCheckedChange={(v) =>
                          setForm({ ...form, kvkk: v === true })
                        }
                        className="mt-0.5"
                      />
                      <span>
                        <Link
                          href="/kvkk"
                          target="_blank"
                          className="underline"
                        >
                          KVKK Aydınlatma Metni
                        </Link>
                        'ni okudum; randevumun oluşturulması için kişisel
                        verilerimin işlenmesini kabul ediyorum. *
                      </span>
                    </label>
                    <label className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Checkbox
                        checked={form.marketing}
                        onCheckedChange={(v) =>
                          setForm({ ...form, marketing: v === true })
                        }
                        className="mt-0.5"
                      />
                      <span>
                        Kampanya ve yeniliklerden haberdar olmak için ticari
                        ileti almayı kabul ediyorum (isteğe bağlı).
                      </span>
                    </label>
                  </div>
                  {form.phone && !phoneOk && (
                    <p className="text-sm text-destructive sm:col-span-2">
                      Lütfen geçerli bir cep telefonu girin.
                    </p>
                  )}
                  <div className="flex justify-end sm:col-span-2">
                    <Button
                      type="submit"
                      variant="lux"
                      size="xl"
                      disabled={!infoOk}
                    >
                      Özeti Gör
                    </Button>
                  </div>
                </form>
              )}

              {step === 5 && service && slot && (
                <div className="bg-card p-6 sm:p-10">
                  <p className="eyebrow mb-6 text-accent">Randevu Özeti</p>
                  <dl className="grid gap-5 sm:grid-cols-2">
                    <Summary k="Hizmet" v={service.name} />
                    <Summary
                      k="Uzman"
                      v={chosenStaff?.full_name ?? "Müsait uzman"}
                    />
                    <Summary k="Tarih" v={formatDateTR(slot.starts_at)} />
                    <Summary k="Saat" v={formatTimeTR(slot.starts_at)} />
                    <Summary
                      k="Süre"
                      v={formatDuration(service.duration_min)}
                    />
                    <Summary
                      k="Ücret"
                      v={formatTRY(service.price) ?? "Salonda belirlenir"}
                    />
                    <Summary k="Ad Soyad" v={`${form.first} ${form.last}`} />
                    <Summary k="Telefon" v={form.phone} />
                  </dl>
                  {error && (
                    <p
                      role="alert"
                      className="mt-6 border-l-2 border-destructive pl-4 text-sm text-destructive"
                    >
                      {error}
                    </p>
                  )}
                  <Button
                    variant="lux"
                    size="xl"
                    className="mt-10 w-full"
                    disabled={submitting}
                    onClick={submit}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" /> Kontrol ediliyor…
                      </>
                    ) : (
                      "Randevuyu Onayla"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="eyebrow text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-b pb-3">
      <dt className="eyebrow text-muted-foreground">{k}</dt>
      <dd className="mt-1 font-display text-2xl text-espresso">{v}</dd>
    </div>
  );
}

function MonthCalendar({
  openWeekdays,
  closed,
  maxDays,
  value,
  onChange,
}: {
  openWeekdays: number[];
  closed: string[];
  maxDays: number;
  value: string | null;
  onChange: (d: string) => void;
}) {
  const today = istanbulDateKey(new Date());
  const [cursor, setCursor] = useState(() => {
    const [y = 2026, m = 1] = today.split("-").map(Number);
    return { y, m: m - 1 };
  });
  const last = useMemo(() => {
    const d = new Date(today + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + maxDays);
    return d.toISOString().slice(0, 10);
  }, [today, maxDays]);
  const first = new Date(Date.UTC(cursor.y, cursor.m, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday first
  const daysIn = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate();
  const cells = Array.from({ length: offset + daysIn }, (_, i) =>
    i < offset ? null : i - offset + 1,
  );
  const monthLabel = new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(first);
  const shift = (n: number) =>
    setCursor(({ y, m }) => {
      const d = new Date(Date.UTC(y, m + n, 1));
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
    });
  const canPrev =
    `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}` > today.slice(0, 7);

  return (
    <div className="bg-card p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          aria-label="Önceki ay"
          disabled={!canPrev}
          onClick={() => shift(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-3xl capitalize text-espresso">
          {monthLabel}
        </p>
        <button
          type="button"
          aria-label="Sonraki ay"
          onClick={() => shift(1)}
          className="grid h-11 w-11 place-items-center rounded-full border"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d) => (
          <span key={d} className="eyebrow py-2 text-muted-foreground">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const key = `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const dow = new Date(key + "T12:00:00Z").getUTCDay();
          const disabled =
            key < today ||
            key > last ||
            !openWeekdays.includes(dow) ||
            closed.includes(key);
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onChange(key)}
              className={cn(
                "aspect-square min-h-11 rounded-full text-sm transition-colors",
                disabled
                  ? "text-muted-foreground/35"
                  : "text-espresso hover:bg-sand",
                value === key &&
                  "bg-accent text-accent-foreground hover:bg-accent",
                key === today &&
                  !disabled &&
                  value !== key &&
                  "ring-1 ring-accent",
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" /> Saatler İstanbul saatine göredir.
      </p>
    </div>
  );
}

function Success({
  result,
  serviceName,
}: {
  result: { reference: string; staff_name: string; starts_at: string };
  serviceName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ensureGsap();
    if (prefersReducedMotion() || !ref.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      "[data-ok-circle]",
      { scale: 0, rotate: -90 },
      { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" },
    ).from(
      "[data-ok-item]",
      { autoAlpha: 0, y: 20, stagger: 0.08, duration: 0.5, ease: "power3.out" },
      "-=0.2",
    );
    return () => {
      tl.kill();
    };
  }, []);
  return (
    <>
      <Header />
      <main
        ref={ref}
        className="grid min-h-screen place-items-center bg-background px-6 pt-24 text-center"
      >
        <div className="max-w-lg">
          <div
            data-ok-circle
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent text-accent-foreground"
          >
            <Check className="h-9 w-9" />
          </div>
          <h1 data-ok-item className="display-section mt-8 text-espresso">
            Randevunuz oluşturuldu.
          </h1>
          <p data-ok-item className="mt-6 text-muted-foreground">
            {serviceName} · {result.staff_name}
            <br />
            {formatDateTR(result.starts_at)} · {formatTimeTR(result.starts_at)}
          </p>
          <p data-ok-item className="mt-8 eyebrow text-muted-foreground">
            Referans numarası
          </p>
          <p
            data-ok-item
            className="font-display text-5xl tracking-[0.2em] text-espresso"
          >
            {result.reference}
          </p>
          <p data-ok-item className="mt-6 text-sm text-muted-foreground">
            Randevunuz salon tarafından onaylandığında sizinle iletişime
            geçeceğiz. Değişiklik için bizi arayabilirsiniz.
          </p>
          <div data-ok-item className="mt-10">
            <Button asChild variant="luxOutline" size="xl">
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
