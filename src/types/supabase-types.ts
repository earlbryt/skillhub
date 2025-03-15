export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Define your tables here
      workshops: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          capacity: number
          price: number
          instructor: string | null
          image_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          capacity: number
          price: number
          instructor?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          capacity?: number
          price?: number
          instructor?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      workshop_attendees: {
        Row: {
          id: string
          workshop_id: string
          user_id: string
          registration_date: string
          status: string
          payment_status: string | null
          payment_reference: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workshop_id: string
          user_id: string
          registration_date?: string
          status: string
          payment_status?: string | null
          payment_reference?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workshop_id?: string
          user_id?: string
          registration_date?: string
          status?: string
          payment_status?: string | null
          payment_reference?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          email: string
          phone: string | null
          department: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          email: string
          phone?: string | null
          department?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string
          phone?: string | null
          department?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          workshop_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          user_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workshop_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          user_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workshop_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          user_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 