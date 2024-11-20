import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationLog } from '../schemas/notification-log.schema';
import { UserPreferencesService } from '../../user-preferences/services/user-preferences.service';
import { NotificationChannel, NotificationLogDto, NotificationResponseDto, NotificationStatsDto, NotificationStatus, NotificationType, Response } from '../dto/notification.dto';
import { validateOrReject } from 'class-validator';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(NotificationLog.name)
    private readonly notificationLogModel: Model<NotificationLog>,
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  /**
   * Sends a notification to the user based on their preferences
   * @param notificationData
   * @returns
   */
  async sendNotification(notificationData: {
    userId: string;
    type: NotificationType;
    channel: NotificationChannel;
    content: { subject: string; body: string };
  }): Promise<Response<NotificationResponseDto>> {
    const { userId, type, channel, content } = notificationData;

    // Fetch user preferences
    const userPreference = await this.userPreferencesService.findByUserId(userId);

    if (!userPreference) {
      throw new BadRequestException('User preferences not found');
    }

    const { preferences } = userPreference.data;

    // Check if the user has opted in for the notification type
    if (!preferences[type]) {
      return {
        status: 'fail',
        message: `User has opted out of ${type} notifications.`,
      };
    }

    // Check if the user allows the specified channel
    if (!preferences.channels[channel]) {
      return {
        status: 'fail',
        message: `User does not allow notifications via ${channel}.`,
      };
    }

    // Simulate sending notification
    const sentStatus = this.simulateNotificationSending(content, channel);

    // Prepare Notification Log DTO
    const notificationLogDto = new NotificationLogDto();
    notificationLogDto.userId = userId;
    notificationLogDto.type = type;
    notificationLogDto.channel = channel;
    notificationLogDto.status = sentStatus ? NotificationStatus.SENT : NotificationStatus.FAILED;
    notificationLogDto.metadata = content;

    // Validate the DTO before saving
    try {
      await validateOrReject(notificationLogDto); // Throws an error if invalid
    } catch (errors) {
      throw new BadRequestException('Invalid notification log data');
    }

    // Log the notification to the database
    const log = await this.notificationLogModel.create(notificationLogDto);

    // Return response with logId and status
    return {
      status: sentStatus ? 'success' : 'fail',
      message: sentStatus
        ? 'Notification sent successfully'
        : 'Notification failed to send',
      data: sentStatus
        ? { success: true, message: 'Notification sent successfully', logId: log._id.toString() }
        : undefined,
    };
  }

  // Simulate sending notification (for testing purposes)
  private simulateNotificationSending(
    content: { subject: string; body: string },
    channel: NotificationChannel,  // Ensure this matches the NotificationChannel type
  ): boolean {
    // Simulate a 90% success rate
    return Math.random() < 0.9;
  }

  /**
   * Fetches all notification logs for a specific user
   * @param userId
   * @returns
   */
  async getNotificationLogs(userId: string): Promise<Response<NotificationLogDto[]>> {
    // Fetch the logs and use lean() to get plain objects
    const logs = await this.notificationLogModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean();  // Returns plain JavaScript objects, without Mongoose Document methods

    // Map the logs to the expected DTO format
    const mappedLogs = logs.map((log) => {
      const notificationLogDto = new NotificationLogDto();
      notificationLogDto.userId = log.userId;
      notificationLogDto.type = log.type as NotificationType;
      notificationLogDto.channel = log.channel as NotificationChannel;
      notificationLogDto.status = log.status as NotificationStatus;
      notificationLogDto.sentAt = log.sentAt;

      return notificationLogDto;
    });

    return {
      status: 'success',
      message: 'Logs fetched successfully',
      data: mappedLogs,
    };
  }

  /**
   * Provides summary statistics for notifications
   * @returns
   */
  async getNotificationStats(): Promise<Response<NotificationStatsDto>> {
    const stats = await this.notificationLogModel.aggregate([
      {
        $group: {
          _id: { type: '$type', status: '$status' },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = stats.reduce((acc, { _id, count }) => {
      const key = `${_id.type}_${_id.status}`;
      acc[key] = count;
      return acc;
    }, {});

    return {
      status: 'success',
      message: 'Stats fetched successfully',
      data: result,
    };
  }
}
