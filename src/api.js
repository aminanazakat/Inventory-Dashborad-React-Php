export const BASE_URL = "http://localhost/ims/endpoints"; // <- adjust if needed

// ----------------- PRODUCTS -----------------
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products/get_products.php`);
  const data = await res.json();
  return data.data || []; // unwrap response {status, data}
};

export const getProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/get_product.php?id=${id}`);
  const data = await res.json();
  return data.data;
};

export const addProduct = async (product) => {
  const res = await fetch(`${BASE_URL}/products/add_product.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
};

export const updateProduct = async (product) => {
  const res = await fetch(`${BASE_URL}/products/update_product.php`, {
    method: "POST", // PHP expects POST, not PUT
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product), // includes product.id
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/delete_product.php`, {
    method: "POST", // PHP expects POST, not DELETE
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.json();
};

// ----------------- REPORTS -----------------
export async function getLowStock() {
  const r = await fetch(`${BASE_URL}/reports/get_low_stock.php`);
  return r.json();
}

export async function getMonthlySales() {
  const r = await fetch(`${BASE_URL}/reports/get_monthly_sales.php`);
  return r.json();
}

export async function getTopSellers() {
  const r = await fetch(`${BASE_URL}/reports/get_top_sellers.php`);
  return r.json();
}

export async function getStockValuation() {
  const r = await fetch(`${BASE_URL}/reports/get_stock_valuation.php`);
  return r.json();
}



// Sales
export async function getSalesReport() {
  const res = await fetch(`${BASE_URL}/reports/sales.php`);
  return res.json();
}

// Purchase
export async function getPurchaseReport() {
  const res = await fetch(`${BASE_URL}/reports/purchase.php`);
  return res.json();
}

// Stock
export async function getStockReport() {
  const res = await fetch(`${BASE_URL}/reports/stock.php`);
  return res.json();
}
