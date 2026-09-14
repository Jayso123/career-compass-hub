export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ats_scans: {
        Row: {
          category_scores: Json
          created_at: string
          id: string
          matched_skills: Json
          missing_keywords: Json
          missing_skills: Json
          recommendations: Json
          resume_name: string
          score: number
          target_role: string
          user_id: string
        }
        Insert: {
          category_scores?: Json
          created_at?: string
          id?: string
          matched_skills?: Json
          missing_keywords?: Json
          missing_skills?: Json
          recommendations?: Json
          resume_name?: string
          score?: number
          target_role?: string
          user_id: string
        }
        Update: {
          category_scores?: Json
          created_at?: string
          id?: string
          matched_skills?: Json
          missing_keywords?: Json
          missing_skills?: Json
          recommendations?: Json
          resume_name?: string
          score?: number
          target_role?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount_inr: number
          candidate_id: string
          candidate_signoff: boolean
          created_at: string
          escrow: Database["public"]["Enums"]["escrow_status"]
          id: string
          mentor_id: string
          mentor_signoff: boolean
          payment_ref: string | null
          ref: string
          session_start: string | null
          slot_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          tier_id: string
        }
        Insert: {
          amount_inr: number
          candidate_id: string
          candidate_signoff?: boolean
          created_at?: string
          escrow?: Database["public"]["Enums"]["escrow_status"]
          id?: string
          mentor_id: string
          mentor_signoff?: boolean
          payment_ref?: string | null
          ref?: string
          session_start?: string | null
          slot_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tier_id: string
        }
        Update: {
          amount_inr?: number
          candidate_id?: string
          candidate_signoff?: boolean
          created_at?: string
          escrow?: Database["public"]["Enums"]["escrow_status"]
          id?: string
          mentor_id?: string
          mentor_signoff?: boolean
          payment_ref?: string | null
          ref?: string
          session_start?: string | null
          slot_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "mentor_availability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "mentorship_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          booking_id: string
          candidate_id: string
          comment: string
          created_at: string
          id: string
          rating: number
        }
        Insert: {
          booking_id: string
          candidate_id: string
          comment?: string
          created_at?: string
          id?: string
          rating: number
        }
        Update: {
          booking_id?: string
          candidate_id?: string
          comment?: string
          created_at?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "feedback_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          base_amount: number
          booking_id: string
          gst_amount: number
          id: string
          invoice_no: string
          issued_at: string
          payment_ref: string | null
          platform_fee: number
          sac_code: string
          total: number
        }
        Insert: {
          base_amount: number
          booking_id: string
          gst_amount: number
          id?: string
          invoice_no: string
          issued_at?: string
          payment_ref?: string | null
          platform_fee: number
          sac_code?: string
          total: number
        }
        Update: {
          base_amount?: number
          booking_id?: string
          gst_amount?: number
          id?: string
          invoice_no?: string
          issued_at?: string
          payment_ref?: string | null
          platform_fee?: number
          sac_code?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_availability: {
        Row: {
          id: string
          mentor_id: string
          slot_start: string
          status: Database["public"]["Enums"]["slot_status"]
        }
        Insert: {
          id?: string
          mentor_id: string
          slot_start: string
          status?: Database["public"]["Enums"]["slot_status"]
        }
        Update: {
          id?: string
          mentor_id?: string
          slot_start?: string
          status?: Database["public"]["Enums"]["slot_status"]
        }
        Relationships: [
          {
            foreignKeyName: "mentor_availability_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          bio: string
          company: string
          created_at: string
          domain: string
          hourly_rate: number
          id: string
          name: string
          prev_company: string | null
          rating: number
          reviews: number
          specializations: string[]
          title: string
          user_id: string | null
          years_exp: number
        }
        Insert: {
          bio?: string
          company?: string
          created_at?: string
          domain?: string
          hourly_rate?: number
          id?: string
          name: string
          prev_company?: string | null
          rating?: number
          reviews?: number
          specializations?: string[]
          title?: string
          user_id?: string | null
          years_exp?: number
        }
        Update: {
          bio?: string
          company?: string
          created_at?: string
          domain?: string
          hourly_rate?: number
          id?: string
          name?: string
          prev_company?: string | null
          rating?: number
          reviews?: number
          specializations?: string[]
          title?: string
          user_id?: string | null
          years_exp?: number
        }
        Relationships: []
      }
      mentorship_tiers: {
        Row: {
          code: string
          description: string
          duration_min: number
          id: string
          name: string
          price_inr: number
          sort_order: number
        }
        Insert: {
          code: string
          description?: string
          duration_min: number
          id?: string
          name: string
          price_inr: number
          sort_order?: number
        }
        Update: {
          code?: string
          description?: string
          duration_min?: number
          id?: string
          name?: string
          price_inr?: number
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
        }
        Relationships: []
      }
      roadmap_milestones: {
        Row: {
          completed: boolean
          created_at: string
          depends_on: string[]
          id: string
          sort_order: number
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          depends_on?: string[]
          id?: string
          sort_order?: number
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          depends_on?: string[]
          id?: string
          sort_order?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      session_evaluations: {
        Row: {
          booking_id: string
          communication: number
          created_at: string
          id: string
          notes: string
          problem_solving: number
          system_architecture: number
        }
        Insert: {
          booking_id: string
          communication?: number
          created_at?: string
          id?: string
          notes?: string
          problem_solving?: number
          system_architecture?: number
        }
        Update: {
          booking_id?: string
          communication?: number
          created_at?: string
          id?: string
          notes?: string
          problem_solving?: number
          system_architecture?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_evaluations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      slot_locks: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          lock_key: string
          locked_by: string
          slot_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          lock_key: string
          locked_by: string
          slot_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          lock_key?: string
          locked_by?: string
          slot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "slot_locks_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "mentor_availability"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "candidate" | "mentor" | "admin"
      booking_status:
        | "pending_payment"
        | "escrow_held"
        | "completed"
        | "cancelled"
      escrow_status: "none" | "held" | "disbursed" | "refunded"
      slot_status: "available" | "held" | "booked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["candidate", "mentor", "admin"],
      booking_status: [
        "pending_payment",
        "escrow_held",
        "completed",
        "cancelled",
      ],
      escrow_status: ["none", "held", "disbursed", "refunded"],
      slot_status: ["available", "held", "booked"],
    },
  },
} as const
