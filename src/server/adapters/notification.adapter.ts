// Transactional Notification Adapter
// Channels: In-App, Email, WhatsApp

export interface NotificationPayload {
  recipientEmail?: string;
  recipientPhone?: string;
  recipientName: string;
  title: string;
  body: string;
  bookingReference?: string;
  metadata?: Record<string, unknown>;
}

export interface INotificationService {
  sendEmail(payload: NotificationPayload): Promise<boolean>;
  sendWhatsApp(payload: NotificationPayload): Promise<boolean>;
  dispatchBookingConfirmation(payload: NotificationPayload): Promise<void>;
}

export class ConsoleMockNotificationService implements INotificationService {
  async sendEmail(payload: NotificationPayload): Promise<boolean> {
    console.log(`[Mock Email Sent] To: ${payload.recipientEmail} | Subject: ${payload.title} | Body: ${payload.body}`);
    return true;
  }

  async sendWhatsApp(payload: NotificationPayload): Promise<boolean> {
    console.log(`[Mock WhatsApp Sent] To: ${payload.recipientPhone} | Message: ${payload.body}`);
    return true;
  }

  async dispatchBookingConfirmation(payload: NotificationPayload): Promise<void> {
    await this.sendEmail(payload);
    if (payload.recipientPhone) {
      await this.sendWhatsApp(payload);
    }
  }
}

export function getNotificationService(): INotificationService {
  return new ConsoleMockNotificationService();
}
