export interface Workshop {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
  price: number;
  instructor: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface WorkshopAttendee {
  id: string;
  workshop_id: string;
  user_id: string;
  registration_date: string;
  status: string;
  payment_status: string | null;
  payment_reference: string | null;
  created_at: string;
  profiles?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  department: string | null;
  role?: string | null;
  created_at: string;
  updated_at: string | null;
}

export type Registration = {
  id: string;
  workshop_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  user_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}
