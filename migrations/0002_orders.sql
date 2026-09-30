-- Orders + line items for the Taza checkout.
-- Prices are whole BDT (taka). Line items snapshot name/unit/price at order
-- time so later catalog edits never change a past order.

create table if not exists orders (
  id                bigserial primary key,
  code              text not null unique,
  idempotency_key   text not null unique,
  status            text not null default 'pending'
                    check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  customer_name     text not null,
  phone             text not null,
  email             text,
  district          text not null,
  address           text not null,
  note              text,
  payment_method    text not null default 'cod' check (payment_method in ('cod')),
  subtotal          integer not null check (subtotal >= 0),
  delivery_fee      integer not null check (delivery_fee >= 0),
  total             integer not null check (total >= 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_phone_created_idx on orders (phone, created_at desc);

create table if not exists order_items (
  id          bigserial primary key,
  order_id    bigint not null references orders (id) on delete cascade,
  product_id  text not null,
  name        text not null,
  unit        text not null,
  unit_price  integer not null check (unit_price >= 0),
  quantity    integer not null check (quantity between 1 and 50)
);

create index if not exists order_items_order_id_idx on order_items (order_id);
