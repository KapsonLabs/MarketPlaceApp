import { o as api } from "./router-rAJgq2Yd.js";
async function uploadServiceRequestAttachment(requestId, file, caption) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("caption", caption);
  const res = await api.post(`/service-requests/${requestId}/attachments/`, formData);
  return res.data?.data ?? res.data;
}
async function createServiceRequest(payload) {
  const res = await api.post("/service-requests/", payload);
  return res.data?.data ?? res.data;
}
async function listMyServiceRequests(page) {
  const res = await api.get("/service-requests/", { params: { page } });
  return res.data?.data ?? res.data;
}
async function listAllMyServiceRequests() {
  const items = [];
  let page = 1;
  while (true) {
    const batch = await listMyServiceRequests(page);
    items.push(...batch.results);
    const next = pageFromNext(batch.next);
    if (next == null) break;
    page = next;
  }
  return items;
}
async function listAdminServiceRequests(page) {
  const res = await api.get("/service-requests/admin/", { params: { page } });
  return res.data?.data ?? res.data;
}
async function listAllAdminServiceRequests() {
  const items = [];
  let page = 1;
  while (true) {
    const batch = await listAdminServiceRequests(page);
    items.push(...batch.results);
    const next = pageFromNext(batch.next);
    if (next == null) break;
    page = next;
  }
  return items;
}
async function getAdminServiceRequest(id) {
  const res = await api.get(`/service-requests/admin/${id}/`);
  return res.data?.data ?? res.data;
}
async function getMyServiceRequest(id) {
  const res = await api.get(`/service-requests/${id}/`);
  return res.data?.data ?? res.data;
}
async function approveServiceRequest(id) {
  const res = await api.post(`/service-requests/admin/${id}/approve/`);
  return res.data?.data ?? res.data;
}
async function setEstimatedCost(id, estimatedCost) {
  const res = await api.post(`/service-requests/admin/${id}/estimate-cost/`, {
    estimated_cost: estimatedCost
  });
  return res.data?.data ?? res.data;
}
async function assignServiceRequest(id, input) {
  const res = await api.post(`/service-requests/admin/${id}/assign/`, input);
  return res.data?.data ?? res.data;
}
async function makeServiceRequestPayment(id, amount) {
  const res = await api.post(`/service-requests/${id}/payments/`, { amount });
  return res.data?.data ?? res.data;
}
function pageFromNext(next) {
  if (!next) return void 0;
  try {
    const page = new URL(next).searchParams.get("page");
    return page ? Number(page) : void 0;
  } catch {
    return void 0;
  }
}
export {
  listAllAdminServiceRequests as a,
  getAdminServiceRequest as b,
  createServiceRequest as c,
  approveServiceRequest as d,
  assignServiceRequest as e,
  getMyServiceRequest as g,
  listAllMyServiceRequests as l,
  makeServiceRequestPayment as m,
  setEstimatedCost as s,
  uploadServiceRequestAttachment as u
};
