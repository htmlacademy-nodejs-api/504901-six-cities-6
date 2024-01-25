import { User } from './index.js';

export type Comment = {
  text: string;
  date: Date;
  rating: number;
  user: User;
}
