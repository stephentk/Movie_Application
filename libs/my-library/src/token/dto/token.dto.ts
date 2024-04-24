export class UserTokenDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  iat?: number;
  exp?: number;
}

export type RefreshTokenDto = Pick<UserTokenDto, 'id' | 'iat' | 'exp'>;
