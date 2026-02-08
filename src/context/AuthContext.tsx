"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, refreshToken: string, user: User) => void;
    logout: () => void;
    refreshAuth: () => Promise<boolean>;
    getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Token expiry buffer (refresh 2 minutes before expiry)
const TOKEN_REFRESH_BUFFER_MS = 2 * 60 * 1000;

// Parse JWT to get expiry time
function getTokenExpiry(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp ? payload.exp * 1000 : null;
    } catch {
        return null;
    }
}

// Check if token is expired or about to expire
function isTokenExpiring(token: string, bufferMs: number = 0): boolean {
    const expiry = getTokenExpiry(token);
    if (!expiry) return true;
    return Date.now() + bufferMs >= expiry;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isRefreshingRef = useRef(false);
    const router = useRouter();

    // Clear refresh timeout
    const clearRefreshTimeout = useCallback(() => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
            refreshTimeoutRef.current = null;
        }
    }, []);

    // Refresh authentication
    const refreshAuth = useCallback(async (): Promise<boolean> => {
        // Prevent concurrent refresh attempts
        if (isRefreshingRef.current) {
            return false;
        }

        isRefreshingRef.current = true;

        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                return false;
            }

            const res = await fetch("/api/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
                credentials: "include",
            });

            if (!res.ok) {
                // Refresh failed, clear auth
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                setToken(null);
                setUser(null);
                return false;
            }

            const data = await res.json();

            // Update tokens
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            // Schedule next refresh
            scheduleRefresh(data.token);

            return true;
        } catch (error) {
            console.error("Token refresh failed:", error);
            return false;
        } finally {
            isRefreshingRef.current = false;
        }
    }, []);

    // Schedule token refresh before expiry
    const scheduleRefresh = useCallback((accessToken: string) => {
        clearRefreshTimeout();

        const expiry = getTokenExpiry(accessToken);
        if (!expiry) return;

        // Schedule refresh 2 minutes before expiry
        const refreshIn = expiry - Date.now() - TOKEN_REFRESH_BUFFER_MS;

        if (refreshIn > 0) {
            refreshTimeoutRef.current = setTimeout(async () => {
                await refreshAuth();
            }, refreshIn);
        }
    }, [clearRefreshTimeout, refreshAuth]);

    // Get valid token (refresh if needed)
    const getToken = useCallback(async (): Promise<string | null> => {
        const currentToken = localStorage.getItem("token");

        if (!currentToken) {
            return null;
        }

        // Check if token is expiring soon
        if (isTokenExpiring(currentToken, TOKEN_REFRESH_BUFFER_MS)) {
            const success = await refreshAuth();
            if (success) {
                return localStorage.getItem("token");
            }
            return null;
        }

        return currentToken;
    }, [refreshAuth]);

    // Login handler
    const login = useCallback((accessToken: string, refreshToken: string, userData: User) => {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(accessToken);
        setUser(userData);

        // Schedule refresh
        scheduleRefresh(accessToken);
    }, [scheduleRefresh]);

    // Logout handler
    const logout = useCallback(() => {
        clearRefreshTimeout();
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        router.push("/login");
    }, [clearRefreshTimeout, router]);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (storedToken && storedUser) {
                try {
                    // Check if token needs refresh
                    if (isTokenExpiring(storedToken, TOKEN_REFRESH_BUFFER_MS)) {
                        // Try to refresh
                        const success = await refreshAuth();
                        if (!success) {
                            setIsLoading(false);
                            return;
                        }
                    } else {
                        // Token still valid
                        setToken(storedToken);
                        setUser(JSON.parse(storedUser));
                        scheduleRefresh(storedToken);
                    }
                } catch {
                    // Invalid stored data
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                }
            }

            setIsLoading(false);
        };

        initAuth();

        // Cleanup on unmount
        return () => {
            clearRefreshTimeout();
        };
    }, [refreshAuth, scheduleRefresh, clearRefreshTimeout]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token && !!user,
                login,
                logout,
                refreshAuth,
                getToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Helper hook for making authenticated requests
export function useAuthFetch() {
    const { getToken, logout, refreshAuth } = useAuth();

    return useCallback(async (url: string, options: RequestInit = {}) => {
        const token = await getToken();

        if (!token) {
            logout();
            throw new Error("Not authenticated");
        }

        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });

        // If 401, try one more refresh
        if (res.status === 401) {
            const success = await refreshAuth();
            if (success) {
                const newToken = await getToken();
                return fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${newToken}`,
                    },
                });
            }
            logout();
            throw new Error("Session expired");
        }

        return res;
    }, [getToken, logout, refreshAuth]);
}
