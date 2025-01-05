import nodemailer from 'nodemailer';
import { config } from '../config';
import logger from '../utils/logger';
import { emailTemplates } from '../templates/emailTemplates';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});


export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  templateData?: Record<string, any>;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    let html = options.html;
    let subject = options.subject;

    logger.info('Processing email request:', {
      to: options.to,
      subject: options.subject,
      template: options.template,
      timestamp: new Date().toISOString()
    });

    if (options.template && options.templateData) {
      const template = emailTemplates[options.template as keyof typeof emailTemplates];
      if (template) {
        const rendered = template(options.templateData);
        html = rendered.html;
        subject = rendered.subject;
        logger.info('Template processed:', {
          template: options.template,
          templateData: options.templateData
        });
      }
    }

    const info = await transporter.sendMail({
      from: `"Your App" <${config.email.user}>`,
      to: options.to,
      subject: subject,
      text: options.text,
      html: html,
    });

    logger.info('Email sent successfully:', {
      messageId: info.messageId,
      to: options.to,
      subject: subject,
      template: options.template,
      timestamp: new Date().toISOString(),
      previewUrl: nodemailer.getTestMessageUrl(info) // Ethereal için preview URL
    });
  } catch (error: any) {
    logger.error('Failed to send email:', {
      to: options.to,
      subject: options.subject,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}; 