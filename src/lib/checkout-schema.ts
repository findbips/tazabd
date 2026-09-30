import { z } from "zod";

/** All 64 districts of Bangladesh. */
export const DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", "Brahmanbaria",
  "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga", "Cumilla", "Cox's Bazar",
  "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj",
  "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat",
  "Khagrachhari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur",
  "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar",
  "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi",
  "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
  "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur",
  "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet",
  "Tangail", "Thakurgaon",
] as const;

/**
 * Normalise a Bangladeshi mobile number to the local 11-digit form
 * (01XXXXXXXXX). Accepts +880 / 880 prefixes, spaces and dashes.
 * Returns null when it is not a valid mobile number.
 */
export function normalizeBdPhone(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+880")) digits = "0" + digits.slice(4);
  else if (digits.startsWith("880")) digits = "0" + digits.slice(3);
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null;
}

const cartLineSchema = z.object({
  productId: z.string().min(1).max(40),
  quantity: z.number().int().min(1).max(50),
});

export const checkoutSchema = z.object({
  /** Client-generated per checkout attempt; makes double-submits safe. */
  idempotencyKey: z.string().min(16).max(64),
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .transform((v, ctx) => {
      const normalised = normalizeBdPhone(v);
      if (!normalised) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid mobile number, e.g. 01712345678",
        });
        return z.NEVER;
      }
      return normalised;
    }),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || z.email().safeParse(v).success, {
      message: "That email address doesn't look right",
    }),
  district: z.enum(DISTRICTS, { message: "Please choose your district" }),
  address: z.string().trim().min(10, "Please enter your full delivery address").max(300),
  note: z
    .string()
    .trim()
    .max(300)
    .optional()
    .transform((v) => (v ? v : undefined)),
  /** Honeypot — real users never fill this in (checked server-side). */
  fax: z.string().max(200).optional(),
  items: z.array(cartLineSchema).min(1, "Your basket is empty").max(40),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
