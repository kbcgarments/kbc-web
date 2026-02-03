export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  isDefault?: boolean;
  country: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  createdAt: string;
  addresses?: CustomerAddress[];
  deletedAt?: string | null;
}

// Tokens returned by backend
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export interface ResetPasswordPayload {
  token: string;
  password: string;
}
