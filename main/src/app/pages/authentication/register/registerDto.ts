export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
  roleUser: string;
  phoneNumber: number;
  posName?: string;
  posLocation?: string;
  posImage?: string;
  posId?: string;
}
