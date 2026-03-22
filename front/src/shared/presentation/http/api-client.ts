import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

// ─── URL base según entorno ───────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// ─── Error de autenticación ───────────────────────────────────────────────────
export class AuthenticationError extends Error {
  constructor(message = "Session expired") {
    super(message);
    this.name = "AuthenticationError";
  }
}

// ─── Instancia base de axios ──────────────────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

// ─── Interceptor de REQUEST — adjunta token automáticamente ──────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // TODO: cuando implementes Zustand, reemplaza esto por:
  //
  //   import { useAuthStore } from "@/shared/store/auth.store"
  //   const token = useAuthStore.getState().token
  //
  // Por ahora el token se puede setear manualmente vía setAuthToken()

  const token = _token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// ─── Interceptor de RESPONSE — manejo de errores globales ────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      throw new AuthenticationError();
    }

    // Extraer mensaje legible desde NestJS / class-validator
    const body = error.response?.data;
    let message = `Error ${error.response?.status ?? "desconocido"}`;

    if (body) {
      if (Array.isArray(body.message)) {
        message = body.message.join(", ");
      } else {
        message = body.message ?? body.error ?? message;
      }
      if (body.statusCode && body.statusCode !== error.response?.status) {
        message = `[${body.statusCode}] ${message}`;
      }
    }

    console.error(`[API Error] ${error.response?.status} ${error.config?.url}: ${message}`);
    throw new Error(message);
  }
);

// ─── Token manual (temporal hasta Zustand) ───────────────────────────────────
let _token: string | null = null;

/** Llama esto después de login para setear el token globalmente */
export function setAuthToken(token: string | null) {
  _token = token;
}

/** Limpia el token (logout) */
export function clearAuthToken() {
  _token = null;
}

export default apiClient;
