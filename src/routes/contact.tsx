import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-12 text-center">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
          Get in touch
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-muted">
          Questions about products, delivery, or a farm partnership? We read
          every note.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          {[
            {
              icon: MapPin,
              title: "Visit us",
              detail: "House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh",
            },
            {
              icon: Phone,
              title: "Call us",
              detail: "+880 1712-345678\n+880 1812-345678",
            },
            {
              icon: Mail,
              title: "Email",
              detail: "hello@taza.com.bd\nsupport@taza.com.bd",
            },
            {
              icon: Clock,
              title: "Hours",
              detail: "Sat – Thu: 9:00 AM – 8:00 PM\nFriday: Closed",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface text-primary ring-1 ring-border">
                <item.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-0.5 whitespace-pre-line text-sm text-muted">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-semibold">Delivery coverage</h3>
            <p className="mt-2 text-sm text-muted">
              Dhaka, Chattogram, Rajshahi, Khulna, Sylhet, and major district
              towns. Free delivery over ৳1,000. Cash on delivery everywhere.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card md:p-8">
          {sent ? (
            <div className="py-12 text-center">
              <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-bg text-primary">
                <Send className="size-7" />
              </span>
              <h3 className="font-display text-xl font-bold">Message sent</h3>
              <p className="mt-2 text-muted">
                We'll reply within a day.
              </p>
              <button
                type="button"
                className="mt-6 text-sm font-medium text-primary"
                onClick={() => setSent(false)}
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <Field label="Full name" id="name">
                <input
                  id="name"
                  required
                  className={fieldClass}
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email or phone" id="reach">
                <input
                  id="reach"
                  required
                  className={fieldClass}
                  placeholder="email@example.com or 01XXXXXXXXX"
                />
              </Field>
              <Field label="Subject" id="subject">
                <select id="subject" className={fieldClass}>
                  <option>General inquiry</option>
                  <option>Order support</option>
                  <option>Partnership / farm</option>
                  <option>Feedback</option>
                </select>
              </Field>
              <Field label="Message" id="message">
                <textarea
                  id="message"
                  required
                  rows={4}
                  className={`${fieldClass} resize-none`}
                  placeholder="How can we help?"
                />
              </Field>
              <Button type="submit" className="w-full" size="lg">
                <Send className="size-4" />
                Send message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2";

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
