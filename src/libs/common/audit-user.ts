// import { Locale } from './locale';

export type AuditUser = {
  id: string;
  email?: string;
  // name: Locale;
  name: string;
  gender?: string;
  userType: string;
  phone?: string;
  profilePicture?: string;
};
