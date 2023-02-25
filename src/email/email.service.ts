import { Injectable } from '@nestjs/common';
import * as Mailjet from 'node-mailjet';

@Injectable()
export class MailService {
  private mailjet: any;

  constructor() {
    this.mailjet = new Mailjet.Client({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET,
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const request = this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_EMAIL_FROM,
            Name: process.env.MAILJET_NAME_FROM,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });

    await request.catch((error) => {
      console.error(`Failed to send email: ${error}`);
      throw new Error(`Failed to send email: ${error}`);
    });
  }
}
