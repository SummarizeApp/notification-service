import amqp from 'amqplib';
import { config } from '../config';
import { sendEmail, EmailOptions } from './emailService';
import logger from '../utils/logger';

let channel: amqp.Channel;

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

export const connectQueue = async () => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      logger.info(`Attempting to connect to RabbitMQ (attempt ${retries + 1}/${MAX_RETRIES})...`, {
        url: config.rabbitmq.url,
        queue: config.rabbitmq.queue
      });

      const connection = await amqp.connect(config.rabbitmq.url);
      channel = await connection.createChannel();
      
      await channel.assertQueue(config.rabbitmq.queue, {
        durable: true
      });

      logger.info('Successfully connected to RabbitMQ, waiting for messages...', {
        queue: config.rabbitmq.queue
      });
      
      channel.consume(config.rabbitmq.queue, async (data) => {
        if (data) {
          try {
            logger.info('Raw message received:', {
              content: data.content.toString(),
              timestamp: new Date().toISOString()
            });

            const emailData: EmailOptions = JSON.parse(data.content.toString());
            
            logger.info('Parsed message from queue:', {
              to: emailData.to,
              subject: emailData.subject,
              template: emailData.template,
              templateData: emailData.templateData,
              timestamp: new Date().toISOString()
            });

            await sendEmail(emailData);
            channel.ack(data);
            
            logger.info('Message successfully processed and acknowledged', {
              to: emailData.to,
              messageId: data.properties.messageId,
              timestamp: new Date().toISOString()
            });
          } catch (error: any) {
            logger.error('Error processing queue message:', {
              error: error.message,
              stack: error.stack,
              rawMessage: data.content.toString(),
              timestamp: new Date().toISOString()
            });
            channel.nack(data, false, true);
          }
        }
      });

      return; // Successful connection, exit the retry loop
    } catch (error: any) {
      retries++;
      logger.error(`Failed to connect to RabbitMQ (attempt ${retries}/${MAX_RETRIES}):`, {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      if (retries === MAX_RETRIES) {
        throw error;
      }

      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
}; 