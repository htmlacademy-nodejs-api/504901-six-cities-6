import { UserType } from './index.js';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  userType: UserType;
}
