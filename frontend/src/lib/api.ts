const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("atin_access_token") : null;
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, body.detail || body.message || res.statusText);
  }
  return res.json();
}

export const auth = {
  register: (data: { username: string; email: string; password: string }) =>
    request<{ access_token: string; refresh_token: string; token_type: string; user: any }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { username: string; password: string }) =>
    request<{ access_token: string; refresh_token: string; token_type: string; user: any }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  refresh: (refresh_token: string) =>
    request<{ access_token: string; refresh_token: string; token_type: string }>("/auth/refresh", { method: "POST", body: JSON.stringify({ refresh_token }) }),
  me: () => request<any>("/auth/me"),
};

export const technologies = {
  list: (page = 1, per_page = 50) =>
    request<{ technologies: any[]; total: number; page: number; per_page: number }>(`/technologies?page=${page}&per_page=${per_page}`),
  get: (slug: string) => request<any>(`/technologies/${slug}`),
  search: (q: string) => request<{ technologies: any[]; total: number; query: string }>(`/search?q=${encodeURIComponent(q)}`),
  categories: () => request<{ categories: string[]; total: number }>("/categories"),
  byCategory: (category: string) => request<{ technologies: any[]; total: number }>(`/categories/${encodeURIComponent(category)}`),
};

export const relationships = {
  list: () => request<any[]>("/relationships"),
  graph: () => request<{ nodes: any[]; edges: any[] }>("/graph"),
  forTechnology: (slug: string) => request<{ technology: any; relationships: any[] }>(`/technologies/${slug}/relationships`),
  related: (slug: string) => request<{ technology: any; related: any[] }>(`/technologies/${slug}/related`),
};

export const careers = {
  list: () => request<{ careers: any[]; total: number }>("/careers"),
  get: (id: number) => request<any>(`/careers/${id}`),
  path: (id: number) => request<{ career: any; steps: any[] }>(`/careers/${id}/path`),
};

export const trends = {
  list: () => request<any[]>("/trends"),
  summary: () => request<{ total: number; emerging: number; growing: number; mature: number; declining: number; average_growth: number }>("/trends/summary"),
  byStage: (stage: string) => request<any[]>(`/trends/${stage}`),
};

export const mentor = {
  chat: (message: string, history: { role: string; content: string }[] = []) =>
    request<{ reply: string; suggestions: string[] }>("/mentor/chat", { method: "POST", body: JSON.stringify({ message, history }) }),
  suggestions: () => request<{ suggestions: string[] }>("/mentor/suggestions"),
};

export const research = {
  list: () => request<any[]>("/research"),
  get: (id: number) => request<any>(`/research/${id}`),
  upload: (title: string, technologies: string, file?: File) => {
    const form = new FormData();
    form.append("title", title);
    form.append("technologies", technologies);
    if (file) form.append("file", file);
    return request<any>("/research/upload", { method: "POST", body: form });
  },
  delete: (id: number) => request<void>(`/research/${id}`, { method: "DELETE" }),
};

export const learning = {
  generate: (data: { goal: string; current_skills?: string[]; time_available?: string; difficulty?: string }) =>
    request<{ id: string; title: string; goal: string; steps: any[]; total_time: string; difficulty: string }>("/learning/generate", { method: "POST", body: JSON.stringify(data) }),
};

export const compare = {
  available: () => request<{ technologies: string[] }>("/compare/available"),
  compare: (tech1: string, tech2: string) =>
    request<{ tech1: string; tech2: string; strengths: Record<string, string>; weaknesses: Record<string, string>; use_cases: Record<string, string>; learning_curve: Record<string, string>; adoption: Record<string, string>; recommendation: string }>(`/compare?tech1=${tech1}&tech2=${tech2}`),
};

export const analytics = {
  dashboard: () => request<{ summary: any; category_distribution: any; difficulty_distribution: any; outlook_distribution: any; top_by_popularity: any[]; fastest_growing: any[] }>("/analytics/dashboard"),
  summary: () => request<any>("/analytics/summary"),
};

export const users = {
  progress: {
    get: () => request<any[]>("/users/progress"),
    update: (data: { technology_slug: string; status: string; score?: number }) =>
      request<any>("/users/progress", { method: "POST", body: JSON.stringify(data) }),
  },
  savedPaths: {
    list: () => request<any[]>("/users/saved-paths"),
    create: (title: string, goal: string, path_data: any) =>
      request<any>(`/users/saved-paths?title=${encodeURIComponent(title)}&goal=${encodeURIComponent(goal)}`, { method: "POST", body: JSON.stringify({ path_data }) }),
    delete: (id: number) => request<void>(`/users/saved-paths/${id}`, { method: "DELETE" }),
  },
  auditLogs: () => request<any[]>("/users/audit-logs"),
};
