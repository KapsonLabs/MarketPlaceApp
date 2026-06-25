import { o as api } from "./router-rAJgq2Yd.js";
async function listServiceCategories(page = 1) {
  const res = await api.get("/service-categories/", { params: { page } });
  return res.data?.data ?? res.data;
}
async function listAllServiceCategories() {
  const items = [];
  let page = 1;
  while (true) {
    const batch = await listServiceCategories(page);
    items.push(...batch.results.filter((c) => c.is_active));
    if (!batch.next) break;
    page += 1;
  }
  return items.sort((a, b) => a.display_order - b.display_order);
}
export {
  listServiceCategories as a,
  listAllServiceCategories as l
};
