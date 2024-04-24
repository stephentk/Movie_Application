import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { EmailDataDto } from '../dto/email.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class EmailService {
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.from = 'Vesti <info@wevesti.com>';
    SendGrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async send(mail: EmailDataDto) {
    console.log('was here....************', mail);
    try {
      const result = await SendGrid.send({
        to: mail.to,
        cc: [...(mail.cc ?? '')],
        from: mail.from ?? this.from,
        subject: mail.subject,
        templateId: mail.template,
        dynamicTemplateData: { subject: mail.subject, ...mail.body },
      });
      Logger.log(`Email sent successfully ${result}`);
      return result;
    } catch (e) {
      console.log('error...', e);
      Logger.log(`Email notification error ${e}`);
      throw new BadRequestException(e.message);
    }
  }

  async sendBatchEmail(users: string[]): Promise<void> {
    // Loop through the users and send emails
    for (const user of users) {
      // await this.mailerService.sendMail({
      //   to: user.email,
      //   subject: 'Your Subject',
      //   template: 'email-template', // Replace with your email template
      //   context: {
      //     // Add template variables
      //   },
      // });
    }
  }

  @Cron('* * * * * *')
  log() {
    // console.log('Hello world!');
  }
}
