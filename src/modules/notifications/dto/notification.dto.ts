import { IsString, IsEnum, IsOptional, IsDate, IsNotEmpty, IsEmail, IsObject, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

// Define Enum for Notification Types
export enum NotificationType {
  MARKETING = 'marketing',
  NEWSLETTER = 'newsletter',
  UPDATES = 'updates',
}

// Define Enum for Notification Channels
export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

// Define Enum for Notification Status
export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

// DTO for Notification Log
export class NotificationLogDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsEnum(NotificationChannel)
  @IsNotEmpty()
  channel: NotificationChannel;

  @IsEnum(NotificationStatus)
  @IsNotEmpty()
  status: NotificationStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  sentAt?: Date;

  @IsOptional()
  @IsString()
  failureReason?: string;

  @IsObject()
  @IsNotEmpty()
  metadata: Record<string, any>;
}

// DTO for Notification Response
export class NotificationResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;

  @IsString()
  logId: string;
}

// DTO for Stats Response
export class NotificationStatsDto {
  @IsObject()
  @IsNotEmpty()
  stats: Record<string, number>;
}

export interface Response<T> {
    status: string;
    message: string;
    data?: T;
    error?: string;
  }
  