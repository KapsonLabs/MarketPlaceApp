/** Derive the next page number from a DRF `next` URL, or undefined when there is none. */
export function pageFromNext(next: string | null): number | undefined {
  if (!next) return undefined;
  try {
    const page = new URL(next).searchParams.get("page");
    return page ? Number(page) : undefined;
  } catch {
    return undefined;
  }
}
