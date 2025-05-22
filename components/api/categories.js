export async function fetchCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/`, {
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}