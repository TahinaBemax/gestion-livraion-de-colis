import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.init()
  }

  private init(){
    (async () => {
      /*const testAccount = await nodemailer.createTestAccount();

      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        tls: {
            rejectUnauthorized: false, // bypass self-signed cert issue
        }
      });
      */
    })();
  }

  async sendPasswordReset(email: string) {
    const newPassword = crypto.randomBytes(8).toString('hex').slice(0, 8);

    const info = await this.transporter.sendMail({
      from: 'support@tempoone.mg',
      to: email,
      subject: 'Restauration de mot de Passe oublié',
      html: `<p>Votre nouveau mot de passe: ${newPassword}</p>`,
    });

    const messageUrl = nodemailer.getTestMessageUrl(info)

    return messageUrl;
  }
}
