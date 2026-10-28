export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      appointments: {
        Row: {
          block_ends_at: string;
          created_at: string;
          customer_id: string;
          customer_note: string | null;
          ends_at: string;
          id: string;
          price: number | null;
          reference: string;
          service_id: string;
          staff_id: string;
          starts_at: string;
          status: Database["public"]["Enums"]["appointment_status"];
          updated_at: string;
        };
        Insert: {
          block_ends_at: string;
          created_at?: string;
          customer_id: string;
          customer_note?: string | null;
          ends_at: string;
          id?: string;
          price?: number | null;
          reference?: string;
          service_id: string;
          staff_id: string;
          starts_at: string;
          status?: Database["public"]["Enums"]["appointment_status"];
          updated_at?: string;
        };
        Update: {
          block_ends_at?: string;
          created_at?: string;
          customer_id?: string;
          customer_note?: string | null;
          ends_at?: string;
          id?: string;
          price?: number | null;
          reference?: string;
          service_id?: string;
          staff_id?: string;
          starts_at?: string;
          status?: Database["public"]["Enums"]["appointment_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          },
        ];
      };
      business_settings: {
        Row: {
          address: string | null;
          closed_dates: string[];
          email: string | null;
          hours_text: string | null;
          id: number;
          instagram: string | null;
          maps_url: string | null;
          max_advance_days: number;
          min_lead_minutes: number;
          phone: string | null;
          slot_step_min: number;
          whatsapp: string | null;
        };
        Insert: {
          address?: string | null;
          closed_dates?: string[];
          email?: string | null;
          hours_text?: string | null;
          id?: number;
          instagram?: string | null;
          maps_url?: string | null;
          max_advance_days?: number;
          min_lead_minutes?: number;
          phone?: string | null;
          slot_step_min?: number;
          whatsapp?: string | null;
        };
        Update: {
          address?: string | null;
          closed_dates?: string[];
          email?: string | null;
          hours_text?: string | null;
          id?: number;
          instagram?: string | null;
          maps_url?: string | null;
          max_advance_days?: number;
          min_lead_minutes?: number;
          phone?: string | null;
          slot_step_min?: number;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
      content_sections: {
        Row: {
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          created_at: string;
          email: string | null;
          first_name: string;
          id: string;
          kvkk_accepted_at: string | null;
          last_name: string;
          marketing_consent: boolean;
          notes: string | null;
          phone: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          first_name: string;
          id?: string;
          kvkk_accepted_at?: string | null;
          last_name: string;
          marketing_consent?: boolean;
          notes?: string | null;
          phone: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          first_name?: string;
          id?: string;
          kvkk_accepted_at?: string | null;
          last_name?: string;
          marketing_consent?: boolean;
          notes?: string | null;
          phone?: string;
        };
        Relationships: [];
      };
      gallery_images: {
        Row: {
          alt: string;
          id: string;
          image_key: string;
          sort: number;
        };
        Insert: {
          alt: string;
          id?: string;
          image_key: string;
          sort?: number;
        };
        Update: {
          alt?: string;
          id?: string;
          image_key?: string;
          sort?: number;
        };
        Relationships: [];
      };
      notification_logs: {
        Row: {
          appointment_id: string | null;
          channel: string;
          created_at: string;
          detail: string | null;
          id: string;
          status: string;
        };
        Insert: {
          appointment_id?: string | null;
          channel: string;
          created_at?: string;
          detail?: string | null;
          id?: string;
          status: string;
        };
        Update: {
          appointment_id?: string | null;
          channel?: string;
          created_at?: string;
          detail?: string | null;
          id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notification_logs_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      service_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort?: number;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sort?: number;
        };
        Relationships: [];
      };
      services: {
        Row: {
          buffer_min: number;
          category_id: string | null;
          created_at: string;
          description: string | null;
          duration_min: number;
          id: string;
          image_key: string | null;
          is_published: boolean;
          name: string;
          price: number | null;
          sort: number;
        };
        Insert: {
          buffer_min?: number;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          duration_min: number;
          id?: string;
          image_key?: string | null;
          is_published?: boolean;
          name: string;
          price?: number | null;
          sort?: number;
        };
        Update: {
          buffer_min?: number;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          duration_min?: number;
          id?: string;
          image_key?: string | null;
          is_published?: boolean;
          name?: string;
          price?: number | null;
          sort?: number;
        };
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      staff: {
        Row: {
          bio: string | null;
          full_name: string;
          id: string;
          is_active: boolean;
          photo_key: string | null;
          sort: number;
          title: string | null;
          user_id: string | null;
        };
        Insert: {
          bio?: string | null;
          full_name: string;
          id?: string;
          is_active?: boolean;
          photo_key?: string | null;
          sort?: number;
          title?: string | null;
          user_id?: string | null;
        };
        Update: {
          bio?: string | null;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          photo_key?: string | null;
          sort?: number;
          title?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      staff_services: {
        Row: {
          service_id: string;
          staff_id: string;
        };
        Insert: {
          service_id: string;
          staff_id: string;
        };
        Update: {
          service_id?: string;
          staff_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_services_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_services_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          },
        ];
      };
      staff_time_off: {
        Row: {
          ends_at: string;
          id: string;
          reason: string | null;
          staff_id: string | null;
          starts_at: string;
        };
        Insert: {
          ends_at: string;
          id?: string;
          reason?: string | null;
          staff_id?: string | null;
          starts_at: string;
        };
        Update: {
          ends_at?: string;
          id?: string;
          reason?: string | null;
          staff_id?: string | null;
          starts_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_time_off_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          },
        ];
      };
      staff_working_hours: {
        Row: {
          break_end: string | null;
          break_start: string | null;
          end_time: string;
          id: string;
          staff_id: string;
          start_time: string;
          weekday: number;
        };
        Insert: {
          break_end?: string | null;
          break_start?: string | null;
          end_time: string;
          id?: string;
          staff_id: string;
          start_time: string;
          weekday: number;
        };
        Update: {
          break_end?: string | null;
          break_start?: string | null;
          end_time?: string;
          id?: string;
          staff_id?: string;
          start_time?: string;
          weekday?: number;
        };
        Relationships: [
          {
            foreignKeyName: "staff_working_hours_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_booking: {
        Args: {
          _email: string;
          _first: string;
          _kvkk: boolean;
          _last: string;
          _marketing: boolean;
          _note: string;
          _phone: string;
          _service: string;
          _staff: string;
          _starts_at: string;
        };
        Returns: {
          ends_at: string;
          reference: string;
          staff_name: string;
          starts_at: string;
        }[];
      };
      get_availability: {
        Args: { _day: string; _service: string; _staff: string };
        Returns: {
          available: boolean;
          slot: string;
          staff_id: string;
          starts_at: string;
        }[];
      };
      get_open_weekdays: {
        Args: { _service: string; _staff: string };
        Returns: number[];
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_team: { Args: { _user_id: string }; Returns: boolean };
      staff_free: {
        Args: {
          _block_end: string;
          _ignore?: string;
          _staff: string;
          _start: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "staff";
      appointment_status:
        "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
      appointment_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
    },
  },
} as const;
