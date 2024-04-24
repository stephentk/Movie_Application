export class UserCreateDto {
  fullName: string;
  email: string;
  dateOfBirth: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export class UserLoginDto {
  email: string;
  password: string;
  registrationToken?: string;
  type?: string;
  receiver?: string;
}

export class UserloginDataResponse {
  id: string;
  email: string;
  factorAuth: boolean;
  profilePictureURL: string;
  firstName: string;
  lastName: string;
}

export class UserCodeConfirmDto {
  code: string;
  id: string;
}
