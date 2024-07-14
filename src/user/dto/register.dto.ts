export class RegisterDTO {
  readonly email: string;
  readonly password: string;
  readonly username: string;
  userImage: string;
  role: 'merchant' | 'customer';
}
