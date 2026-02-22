async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchOpenAPI(): Promise<any> {
  const res = await fetch(`/api/openapi`);
  if (!res.ok) throw new Error("Failed to load OpenAPI");
  return res.json();
}

export const predict = (input: any) => postJSON("/predict", input);
export const uncertainty = (input: any) => postJSON("/uncertainty", input);
export const recommend = (input: any) => postJSON("/recommend", input);
