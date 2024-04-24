import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from './service/email.service';
@Global()
@Module({
  providers: [EmailService],
  imports: [HttpModule],
  exports: [EmailService],
})
export class EmailModule {}
