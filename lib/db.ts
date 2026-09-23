import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";

const isLocal = process.env.DB_ENV === "local";

// Local PostgreSQL pool
const localPool = isLocal
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  : null;

// Supabase client
const supabaseClient =
  !isLocal
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
      )
    : null;

// ————————————————————————————
// PRODUCTS
// ————————————————————————————
export async function getProducts() {
  if (isLocal) {
    const { rows } = await localPool!.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    return rows;
  }
  const { data } = await supabaseClient!.from("products").select("*").order("created_at", { ascending: false });
  return data;
}

export async function createProduct(product: Record<string, unknown>) {
  if (isLocal) {
    const { rows } = await localPool!.query(
      `INSERT INTO products (id, name, family, price, badge, notes, emoji, image, gender)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        product.id,
        product.name,
        product.family,
        product.price,
        product.badge,
        product.notes,
        product.emoji,
        product.image,
        product.gender,
      ]
    );
    return rows[0];
  }
  const { data } = await supabaseClient!.from("products").insert(product).select().single();
  return data;
}

export async function updateProduct(id: number, product: Record<string, unknown>) {
  if (isLocal) {
    const fields = Object.keys(product)
      .map((k, i) => `${k} = $${i + 2}`)
      .join(", ");
    const values = Object.values(product);
    const { rows } = await localPool!.query(
      `UPDATE products SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return rows[0];
  }
  const { data } = await supabaseClient!.from("products").update(product).eq("id", id).select().single();
  return data;
}

export async function deleteProduct(id: number) {
  if (isLocal) {
    await localPool!.query("DELETE FROM products WHERE id = $1", [id]);
    return { ok: true };
  }
  await supabaseClient!.from("products").delete().eq("id", id);
  return { ok: true };
}

// ————————————————————————————
// CATEGORIES
// ————————————————————————————
export async function getCategories() {
  if (isLocal) {
    const { rows } = await localPool!.query(
      "SELECT * FROM categories ORDER BY created_at ASC"
    );
    return rows;
  }
  const { data } = await supabaseClient!.from("categories").select("*").order("created_at", { ascending: true });
  return data;
}

export async function createCategory(name: string) {
  if (isLocal) {
    const { rows } = await localPool!.query(
      "INSERT INTO categories (id, name) VALUES ($1, $2) RETURNING *",
      [Date.now(), name]
    );
    return rows[0];
  }
  const { data } = await supabaseClient!.from("categories").insert({ id: Date.now(), name }).select().single();
  return data;
}