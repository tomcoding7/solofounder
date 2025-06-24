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
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          xp: number
          level: number
          streak: number
          last_action_date: string | null
          class: string
          stats: {
            execution: number
            resilience: number
            conviction: number
            influence: number
          }
          momentum: {
            multiplier: number
            lastActionTimestamp: string | null
            isActive: boolean
            streakDays: number
          }
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          xp?: number
          level?: number
          streak?: number
          last_action_date?: string | null
          class?: string
          stats?: {
            execution: number
            resilience: number
            conviction: number
            influence: number
          }
          momentum?: {
            multiplier: number
            lastActionTimestamp: string | null
            isActive: boolean
            streakDays: number
          }
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          xp?: number
          level?: number
          streak?: number
          last_action_date?: string | null
          class?: string
          stats?: {
            execution: number
            resilience: number
            conviction: number
            influence: number
          }
          momentum?: {
            multiplier: number
            lastActionTimestamp: string | null
            isActive: boolean
            streakDays: number
          }
        }
      }
      actions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          action_id: string
          xp: number
          multiplier: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          action_id: string
          xp: number
          multiplier: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          action_id?: string
          xp?: number
          multiplier?: number
        }
      }
      achievements: {
        Row: {
          id: string
          created_at: string
          user_id: string
          achievement_id: string
          progress: number
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          achievement_id: string
          progress: number
          completed: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          achievement_id?: string
          progress?: number
          completed?: boolean
          completed_at?: string | null
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