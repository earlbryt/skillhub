
export type Workshop = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
  image_url: string | null;
  price: number;
  instructor: string | null;
  created_at: string;
  updated_at: string;
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
