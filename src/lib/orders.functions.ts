import { createServerFn } from "@tanstack/react-start";
import type { OrderView, PlaceOrderResult } from "./orders.server";

/** Public: place an order from the checkout form. Never throws for expected failures. */
export const placeOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }): Promise<PlaceOrderResult> => {
    const { placeOrderImpl } = await import("./orders.server");
    try {
      return await placeOrderImpl(data);
    } catch (err) {
      console.error("[orders] placeOrder crashed:", err);
      const message =
        err instanceof Error && err.message.includes("not configured")
          ? "The store is temporarily unable to take orders. Please call us to order."
          : "Something went wrong. Please try again.";
      return { ok: false, error: message };
    }
  });

/** Public: order confirmation / status by order code (phone masked). */
export const getOrder = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const code = (data as { code?: unknown } | null)?.code;
    if (typeof code !== "string" || code.length > 32) throw new Error("Invalid order code");
    return { code };
  })
  .handler(async ({ data }): Promise<OrderView | null> => {
    const { getPublicOrder } = await import("./orders.server");
    return getPublicOrder(data.code);
  });

/** Admin: list recent orders (password-gated). */
export const adminOrders = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { password?: unknown })
  .handler(async ({ data }): Promise<OrderView[]> => {
    const { adminListOrders } = await import("./orders.server");
    return adminListOrders(data.password);
  });

/** Admin: change an order's status (password-gated). */
export const adminUpdateStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { password?: unknown; code?: unknown; status?: unknown })
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { adminSetStatus } = await import("./orders.server");
    return adminSetStatus(data.password, data.code, data.status);
  });
