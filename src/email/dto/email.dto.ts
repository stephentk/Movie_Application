import { EmailTemplateIdEnum } from '../enum/email.enum';

export class EmailDataDto {
  from?: string;
  to: string;
  cc?: string[];
  subject: string;
  body?: {
    title: string;
    message?: string;
    body?: string;
    code?: string;
    username: string;
  };
  template: EmailTemplateIdEnum;
}
