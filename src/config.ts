import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.NOTIFICATION_PORT || 4000,
  email: {
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672',
    queue: 'notification_queue'
  }
}; 