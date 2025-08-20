export interface User {
  id: string;
  name?: string;
  avatar?: string;
  user_sta?: string;
  user_ad_r?: string;
  email?: string;

  [key: string]: unknown;
}
