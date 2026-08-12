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
      profiles: {
        Row: {
          id: string
          full_name: string
          professional_title: string
          headline: string
          about: string
          location: string
          email: string
          phone: string
          profile_image: string
          cv_file_url: string
          resume_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string
          professional_title?: string
          headline?: string
          about?: string
          location?: string
          email?: string
          phone?: string
          profile_image?: string
          cv_file_url?: string
          resume_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          professional_title?: string
          headline?: string
          about?: string
          location?: string
          email?: string
          phone?: string
          profile_image?: string
          cv_file_url?: string
          resume_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string
          type: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: string
          type?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          type?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          icon: string
          proficiency: number
          years_experience: number
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string
          description?: string
          icon?: string
          proficiency?: number
          years_experience?: number
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          icon?: string
          proficiency?: number
          years_experience?: number
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          job_title: string
          company: string
          location: string
          employment_type: string
          start_date: string | null
          end_date: string | null
          is_current: boolean
          description: string
          responsibilities: string
          technologies: string[]
          company_logo: string
          company_website: string
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_title: string
          company: string
          location?: string
          employment_type?: string
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          description?: string
          responsibilities?: string
          technologies?: string[]
          company_logo?: string
          company_website?: string
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_title?: string
          company?: string
          location?: string
          employment_type?: string
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          description?: string
          responsibilities?: string
          technologies?: string[]
          company_logo?: string
          company_website?: string
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          name: string
          issuing_organization: string
          issue_date: string | null
          expiration_date: string | null
          credential_id: string
          credential_url: string
          certificate_image: string
          description: string
          skills: string[]
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          issuing_organization: string
          issue_date?: string | null
          expiration_date?: string | null
          credential_id?: string
          credential_url?: string
          certificate_image?: string
          description?: string
          skills?: string[]
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuing_organization?: string
          issue_date?: string | null
          expiration_date?: string | null
          credential_id?: string
          credential_url?: string
          certificate_image?: string
          description?: string
          skills?: string[]
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string
          description: string
          main_image: string
          technologies: string[]
          category: string
          start_date: string | null
          end_date: string | null
          duration: string
          status: string
          github_url: string
          live_url: string
          demo_url: string
          documentation_url: string
          other_urls: Json
          challenges: string
          solutions: string
          key_features: string
          my_role: string
          results: string
          lessons_learned: string
          is_featured: boolean
          display_order: number
          is_published: boolean
          meta_title: string
          meta_description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description?: string
          description?: string
          main_image?: string
          technologies?: string[]
          category?: string
          start_date?: string | null
          end_date?: string | null
          duration?: string
          status?: string
          github_url?: string
          live_url?: string
          demo_url?: string
          documentation_url?: string
          other_urls?: Json
          challenges?: string
          solutions?: string
          key_features?: string
          my_role?: string
          results?: string
          lessons_learned?: string
          is_featured?: boolean
          display_order?: number
          is_published?: boolean
          meta_title?: string
          meta_description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          short_description?: string
          description?: string
          main_image?: string
          technologies?: string[]
          category?: string
          start_date?: string | null
          end_date?: string | null
          duration?: string
          status?: string
          github_url?: string
          live_url?: string
          demo_url?: string
          documentation_url?: string
          other_urls?: Json
          challenges?: string
          solutions?: string
          key_features?: string
          my_role?: string
          results?: string
          lessons_learned?: string
          is_featured?: boolean
          display_order?: number
          is_published?: boolean
          meta_title?: string
          meta_description?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          image_url: string
          caption: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          image_url: string
          caption?: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          image_url?: string
          caption?: string
          display_order?: number
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          icon: string
          short_description: string
          description: string
          features: string
          starting_price: string
          cta_text: string
          cta_link: string
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          icon?: string
          short_description?: string
          description?: string
          features?: string
          starting_price?: string
          cta_text?: string
          cta_link?: string
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          icon?: string
          short_description?: string
          description?: string
          features?: string
          starting_price?: string
          cta_text?: string
          cta_link?: string
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      education: {
        Row: {
          id: string
          degree: string
          institution: string
          location: string
          start_date: string | null
          end_date: string | null
          description: string
          gpa: string
          website: string
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          degree: string
          institution: string
          location?: string
          start_date?: string | null
          end_date?: string | null
          description?: string
          gpa?: string
          website?: string
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          degree?: string
          institution?: string
          location?: string
          start_date?: string | null
          end_date?: string | null
          description?: string
          gpa?: string
          website?: string
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          platform: string
          url: string
          username: string
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          url: string
          username?: string
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          url?: string
          username?: string
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          phone: string
          company: string
          service_interest: string
          is_read: boolean
          is_archived: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string
          message: string
          phone?: string
          company?: string
          service_interest?: string
          is_read?: boolean
          is_archived?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          phone?: string
          company?: string
          service_interest?: string
          is_read?: boolean
          is_archived?: boolean
          created_at?: string
        }
      }
      seo_settings: {
        Row: {
          id: string
          page_slug: string
          meta_title: string
          meta_description: string
          og_image: string
          keywords: string
          canonical_url: string
          is_indexable: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_slug: string
          meta_title?: string
          meta_description?: string
          og_image?: string
          keywords?: string
          canonical_url?: string
          is_indexable?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_slug?: string
          meta_title?: string
          meta_description?: string
          og_image?: string
          keywords?: string
          canonical_url?: string
          is_indexable?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
