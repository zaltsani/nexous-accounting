export interface AuthContext {
  userId: string;
  /** Only present once the user has selected a tenant (the JWT carries it as `tid`). */
  tenantId?: string;
  role?: string;
}

export interface AuthRequest {
  headers: Record<string, string | string[] | undefined>;
  auth?: AuthContext;
}
