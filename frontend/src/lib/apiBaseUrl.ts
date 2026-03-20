const defaultApiUrl = 'http://localhost:3001'

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim()
  if (!configured) return defaultApiUrl
  return configured.endsWith('/') ? configured.slice(0, -1) : configured
}
