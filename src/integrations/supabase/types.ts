export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      consumer_favorite_merchants: {
        Row: {
          created_at: string | null
          merchant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          merchant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          merchant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumer_favorite_merchants_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consumer_favorite_merchants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consumer_preferences: {
        Row: {
          favorite_brands: Json | null
          favorite_categories: Json | null
          notification_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          favorite_brands?: Json | null
          favorite_categories?: Json | null
          notification_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          favorite_brands?: Json | null
          favorite_categories?: Json | null
          notification_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumer_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consumer_saved_offers: {
        Row: {
          created_at: string | null
          offer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          offer_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          offer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumer_saved_offers_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consumer_saved_offers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_offer_selections: {
        Row: {
          created_at: string | null
          featured: boolean | null
          in_stock: boolean | null
          local_notes: string | null
          local_price: number | null
          merchant_id: string
          offer_id: string
          organization_id: string | null
          qr_code_generated: boolean | null
          stock_level: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          featured?: boolean | null
          in_stock?: boolean | null
          local_notes?: string | null
          local_price?: number | null
          merchant_id: string
          offer_id: string
          organization_id?: string | null
          qr_code_generated?: boolean | null
          stock_level?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          featured?: boolean | null
          in_stock?: boolean | null
          local_notes?: string | null
          local_price?: number | null
          merchant_id?: string
          offer_id?: string
          organization_id?: string | null
          qr_code_generated?: boolean | null
          stock_level?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_offer_selections_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_offer_selections_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_offer_selections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_organization_affiliations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          merchant_id: string
          organization_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          merchant_id: string
          organization_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          merchant_id?: string
          organization_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_organization_affiliations_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_organization_affiliations_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_organization_affiliations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          active: boolean | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone: string | null
          postal_code: string | null
          street_address: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          street_address?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          street_address?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      offer_analytics: {
        Row: {
          clicks: number | null
          id: string
          last_updated: string | null
          merchant_id: string | null
          offer_id: string | null
          organization_id: string | null
          saves: number | null
          shares: number | null
          views: number | null
        }
        Insert: {
          clicks?: number | null
          id?: string
          last_updated?: string | null
          merchant_id?: string | null
          offer_id?: string | null
          organization_id?: string | null
          saves?: number | null
          shares?: number | null
          views?: number | null
        }
        Update: {
          clicks?: number | null
          id?: string
          last_updated?: string | null
          merchant_id?: string | null
          offer_id?: string | null
          organization_id?: string | null
          saves?: number | null
          shares?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_analytics_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_analytics_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          display_order: number | null
          id: string
          media_type: string
          offer_id: string | null
          thumbnail_url: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_type: string
          offer_id?: string | null
          thumbnail_url?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_type?: string
          offer_id?: string | null
          thumbnail_url?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "offer_media_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_organization_customizations: {
        Row: {
          additional_terms: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          custom_description: string | null
          custom_end_date: string | null
          custom_offer_price: number | null
          custom_regular_price: number | null
          custom_settings: Json | null
          custom_start_date: string | null
          custom_title: string | null
          offer_id: string
          organization_id: string
          rejection_reason: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          additional_terms?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          custom_description?: string | null
          custom_end_date?: string | null
          custom_offer_price?: number | null
          custom_regular_price?: number | null
          custom_settings?: Json | null
          custom_start_date?: string | null
          custom_title?: string | null
          offer_id: string
          organization_id: string
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_terms?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          custom_description?: string | null
          custom_end_date?: string | null
          custom_offer_price?: number | null
          custom_regular_price?: number | null
          custom_settings?: Json | null
          custom_start_date?: string | null
          custom_title?: string | null
          offer_id?: string
          organization_id?: string
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_organization_customizations_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_organization_customizations_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_organization_customizations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          description: string
          details: string | null
          end_date: string
          id: string
          offer_price: number
          product_name: string
          product_sku: string | null
          product_specifications: Json | null
          regular_price: number
          start_date: string
          status: string | null
          supplier_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          details?: string | null
          end_date: string
          id?: string
          offer_price: number
          product_name: string
          product_sku?: string | null
          product_specifications?: Json | null
          regular_price: number
          start_date: string
          status?: string | null
          supplier_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          details?: string | null
          end_date?: string
          id?: string
          offer_price?: number
          product_name?: string
          product_sku?: string | null
          product_specifications?: Json | null
          regular_price?: number
          start_date?: string
          status?: string | null
          supplier_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_admins: {
        Row: {
          created_at: string | null
          organization_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          organization_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_admins_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_settings: {
        Row: {
          custom_settings: Json | null
          default_terms: string | null
          max_promotion_days: number | null
          min_discount_percentage: number | null
          notification_email: string | null
          organization_id: string
          require_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          custom_settings?: Json | null
          default_terms?: string | null
          max_promotion_days?: number | null
          min_discount_percentage?: number | null
          notification_email?: string | null
          organization_id: string
          require_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          custom_settings?: Json | null
          default_terms?: string | null
          max_promotion_days?: number | null
          min_discount_percentage?: number | null
          notification_email?: string | null
          organization_id?: string
          require_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      supplier_organization_affiliations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          organization_id: string
          status: string | null
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          organization_id: string
          status?: string | null
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          organization_id?: string
          status?: string | null
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_organization_affiliations_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_organization_affiliations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_organization_affiliations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_merchant_affiliations: {
        Row: {
          created_at: string | null
          is_admin: boolean | null
          merchant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          is_admin?: boolean | null
          merchant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          is_admin?: boolean | null
          merchant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_merchant_affiliations_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_merchant_affiliations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          role_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_supplier_affiliations: {
        Row: {
          created_at: string | null
          is_admin: boolean | null
          supplier_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          is_admin?: boolean | null
          supplier_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          is_admin?: boolean | null
          supplier_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_supplier_affiliations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_supplier_affiliations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active: boolean | null
          created_at: string | null
          first_name: string | null
          id: string
          job_title: string | null
          last_login: string | null
          last_name: string | null
          phone: string | null
          profile_image_url: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          first_name?: string | null
          id: string
          job_title?: string | null
          last_login?: string | null
          last_name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_login?: string | null
          last_name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_merchant_user: {
        Args: { merchant_id: string }
        Returns: boolean
      }
      is_org_admin: {
        Args: { org_id: string }
        Returns: boolean
      }
      is_platform_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_supplier_user: {
        Args: { supplier_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
