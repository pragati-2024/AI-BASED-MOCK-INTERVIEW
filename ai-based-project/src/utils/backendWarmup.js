const DEFAULT_BACKEND_ORIGIN = "https://project-emqa.onrender.com";

const getBackendOrigin = () => {
  const fromEnv = import.meta?.env?.VITE_BACKEND_ORIGIN;
  if (fromEnv && String(fromEnv).trim()) return String(fromEnv).trim();
  return DEFAULT_BACKEND_ORIGIN;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (input, init = {}, timeoutMs = 25000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

let warmupPromise = null;

export const warmupBackend = async ({ force = false } = {}) => {
  if (typeof window === "undefined") return false;

  if (!force && warmupPromise) return warmupPromise;

  warmupPromise = (async () => {
    // 1) Try through same-origin /api (works in dev proxy + Vercel rewrites)
    try {
      const res = await fetchWithTimeout(
        "/api/health",
        { method: "GET", cache: "no-store" },
        25000,
      );
      if (res && res.ok) return true;
    } catch {
      // continue
    }

    // 2) If backend is asleep and Vercel rewrite times out, ping backend directly.
    // Use `no-cors` so this request is best-effort wake-up even if CORS isn't set.
    try {
      await fetch(`${getBackendOrigin()}/api/health`, {
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
      });
    } catch {
      // ignore
    }

    // Give Render a moment to spin up.
    await sleep(1500);

    // 3) Try /api/health again.
    try {
      const res2 = await fetchWithTimeout(
        "/api/health",
        { method: "GET", cache: "no-store" },
        25000,
      );
      return !!(res2 && res2.ok);
    } catch {
      return false;
    }
  })();

  return warmupPromise;
};

const isRetriableStatus = (status) => {
  // Typical gateway / timeout / warmup failures
  return (
    status === 408 ||
    status === 429 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
};

export const fetchWithWarmupRetry = async (
  input,
  init,
  { retries = 1, retryDelayMs = 1800 } = {},
) => {
  // Warm up once before the first real request.
  await warmupBackend();

  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(input, init);
      if (res.ok) return res;

      if (attempt < retries && isRetriableStatus(res.status)) {
        await warmupBackend({ force: true });
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }

      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await warmupBackend({ force: true });
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }
      throw err;
    }
  }

  // Shouldn't reach here, but keep a safe fallback.
  if (lastError) throw lastError;
  return fetch(input, init);
};
