import { Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailService } from './email.service';

@Module({
  providers: [
    MailService,
    {
      provide: 'MAILER',
      useFactory: () =>
        nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASSWORD,
          },
        }),
    },
  ],
  exports: [MailService],
})
export class EmailModule {}
