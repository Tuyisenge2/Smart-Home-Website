import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  email: string;
  name: string;
  picture: string;
  role: string;
  exp: number;
  iat: number;
}

export class JwtService {
  private static readonly TOKEN_KEY = "auth_token";

  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  static isTokenValid(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) return false;
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  static getTokenData(token: string): {
    email: string;
    name: string;
    picture: string;
    role: string;
  } | null {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      role: decoded.role,
    };
  }

  static storeToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
}
