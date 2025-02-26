export class ChangePasswordRequestDto{
  login: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}