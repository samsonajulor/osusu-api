export interface User {
  id: number;
  email: string;
  username?: string;
  phoneNumber?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
}
