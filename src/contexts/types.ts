export type USERDATA = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  phone: string;
  email: string;
  roles: string[];
  image: string | null;
  disabled: boolean;
  pusher_id: string;
  tenant: string;
  license_key: string | null;
} | null;
