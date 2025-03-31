interface AppMetadata {
  provider: string;
  providers: string[];
}

interface UserIdentity {
  id: string;
  user_id: string;
  identity_data: Record<string, any>;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
}

// supabase user type
export interface SupabaseUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string | null;
  phone: string;
  phone_confirmed_at: string | null;
  confirmed_at: string | null;
  last_sign_in_at: string | null;
  app_metadata: AppMetadata;
  user_metadata: Record<string, any>;
  identities: UserIdentity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

// user profile type
export interface UserProfile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  role: "admin" | "user" | "guest";
}
