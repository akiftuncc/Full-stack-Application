export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  userName: string;
  birthDate: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface DecodedToken {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}
