import { o as api } from "./router-rAJgq2Yd.js";
async function listProviders(page) {
  const res = await api.get("/providers/", { params: { page } });
  return res.data?.data ?? res.data;
}
async function listAllProviders() {
  const items = [];
  let page = 1;
  while (true) {
    const batch = await listProviders(page);
    items.push(...batch.results);
    const next = nextPageParam(batch);
    if (next == null) break;
    page = next;
  }
  return items;
}
async function getProvider(id) {
  const res = await api.get(`/providers/${id}/`);
  return res.data?.data ?? res.data;
}
const SKILL_LEVELS = ["beginner", "intermediate", "expert"];
const CERTIFICATION_STATUSES = ["none", "claimed", "verified"];
async function createProviderService(providerId, payload) {
  const res = await api.post(`/providers/${providerId}/services/`, payload);
  return res.data?.data ?? res.data;
}
function nextPageParam(lastPage) {
  if (!lastPage.next) return void 0;
  try {
    const url = new URL(lastPage.next);
    const page = url.searchParams.get("page");
    return page ? Number(page) : void 0;
  } catch {
    return void 0;
  }
}
export {
  CERTIFICATION_STATUSES as C,
  SKILL_LEVELS as S,
  createProviderService as c,
  getProvider as g,
  listAllProviders as l
};
