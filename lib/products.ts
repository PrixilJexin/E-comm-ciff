import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "products.json");

export type Product = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  soldOut: boolean;
};

function readData(): Product[] {
  const fileData = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(fileData);
}

function writeData(products: Product[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), "utf-8");
}

export function getAllProducts(): Product[] {
  return readData();
}

export function addProduct(product: Omit<Product, "id">): Product {
  const products = readData();
  const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;
  const newProduct: Product = { id: maxId + 1, ...product };
  products.push(newProduct);
  writeData(products);
  return newProduct;
}

export function updateProduct(
  id: number,
  partial: Partial<Omit<Product, "id">>
): Product | null {
  const products = readData();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  const updated = { ...products[index], ...partial };
  products[index] = updated;
  writeData(products);
  return updated;
}

export function deleteProduct(id: number): boolean {
  const products = readData();
  const newProducts = products.filter(p => p.id !== id);
  if (newProducts.length === products.length) return false;
  writeData(newProducts);
  return true;
}
