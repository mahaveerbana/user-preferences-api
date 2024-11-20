import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { NotificationChannel, NotificationResponseDto, NotificationType, Response } from '../dto/notification.dto';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  // POST /api/notifications/send - Send notification
  @Post('send')
  async sendNotification(
    @Body() notificationData: {
      userId: string;
      type: NotificationType;
      channel: NotificationChannel;
      content: { subject: string; body: string };
    },
  ): Promise<Response<NotificationResponseDto>> {
    return this.service.sendNotification(notificationData);
  }

  // GET /api/notifications/:userId/logs - Get notification logs for a specific user
  @Get(':userId/logs')
  async getNotificationLogs(@Param('userId') userId: string): Promise<Response<any>> {
    return this.service.getNotificationLogs(userId);
  }

  // GET /api/notifications/stats - Get notification statistics
  @Get('stats')
  async getNotificationStats(): Promise<Response<any>> {
    return this.service.getNotificationStats();
  }
}
