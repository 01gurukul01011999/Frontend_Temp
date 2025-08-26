export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          address: string | null;
          state: string | null;
          city: string | null;
          pincode: string | null;
          business_name: string | null;
          gst_number: string | null;
          avatar_url: string | null;
          account_status: 'pending' | 'completed' | 'suspended';
          role: 'seller' | 'admin' | 'customer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          address?: string | null;
          state?: string | null;
          city?: string | null;
          pincode?: string | null;
          business_name?: string | null;
          gst_number?: string | null;
          avatar_url?: string | null;
          account_status?: 'pending' | 'completed' | 'suspended';
          role?: 'seller' | 'admin' | 'customer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          address?: string | null;
          state?: string | null;
          city?: string | null;
          pincode?: string | null;
          business_name?: string | null;
          gst_number?: string | null;
          avatar_url?: string | null;
          account_status?: 'pending' | 'completed' | 'suspended';
          role?: 'seller' | 'admin' | 'customer';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
