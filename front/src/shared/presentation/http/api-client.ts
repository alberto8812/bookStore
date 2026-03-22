import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// TODO: cuando implementes Zustand, importa el store así:
// import { useAuthStore } from "@/shared/store/auth.store"

// import { auth } from "@/auth";

// ─── URL base según entorno ───────────────────────────────────────────────────
const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || "http://localhost:3000";
};

// ─── Error de autenticación ───────────────────────────────────────────────────
export class AuthenticationError extends Error {
    constructor(message = "Session expired") {
        super(message);
        this.name = "AuthenticationError";
    }
}

// ─── Instancia axios ──────────────────────────────────────────────────────────
const instance = axios.create({
    baseURL: getApiUrl(),
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15_000,
});

// ─── Interceptor REQUEST — adjunta token en todas las consultas ───────────────
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // TODO: reemplaza _token por Zustand cuando implementes auth:
    // const token = useAuthStore.getState().token

    // const session = await auth();
    // if (session?.error === "RefreshTokenError") throw new AuthenticationError();
    // const token = session?.access_token;

    const token = _token;
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(`[API Client] Calling: ${config.baseURL}${config.url}`);
    return config;
});

// ─── Interceptor RESPONSE — manejo de errores globales ───────────────────────
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            throw new AuthenticationError();
        }

        let message = `Error ${error.response?.status}`;
        try {
            const body = error.response?.data;
            // Handle class-validator array of messages
            if (Array.isArray(body?.message)) {
                message = body.message.join(", ");
            } else {
                message = body?.message ?? body?.error ?? message;
            }
            // Append statusCode if available
            if (body?.statusCode && body.statusCode !== error.response?.status) {
                message = `[${body.statusCode}] ${message}`;
            }
        } catch {
            // response wasn't JSON
        }

        console.error(`[API Error] ${error.response?.status} ${error.config?.url}: ${message}`);
        throw new Error(message);
    }
);

// ─── Token temporal (hasta implementar Zustand) ───────────────────────────────
let _token: string | null = null;

/** Llama esto después del login para setear el token globalmente */
export function setAuthToken(token: string | null) {
    _token = token;
}

/** Limpia el token en logout */
export function clearAuthToken() {
    _token = null;
}

// ─── Wrapper con la misma firma que el fetch original ────────────────────────
// Permite usar: apiClient<T>(path, { method, body, headers })
// igual que antes, sin cambiar el código existente (generiActionQuery, etc.)

interface ApiOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    headers?: Record<string, string>;
}

export async function apiClient<T = unknown>(
    path: string,
    options: ApiOptions = {}
): Promise<T> {
    const { method = "GET", body, headers } = options;

    const response = await instance.request<T>({
        url: path,
        method,
        data: body ? JSON.parse(body) : undefined,
        headers,
    });

    return response.data;
}

// Expone la instancia axios directa para casos avanzados
export { instance as axiosInstance };
