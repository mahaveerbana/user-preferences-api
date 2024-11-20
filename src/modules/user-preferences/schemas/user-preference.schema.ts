import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Enum for Frequency
export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never',
}

// Interface for ChannelPreferences
export interface ChannelPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

@Schema({ timestamps: true })
export class UserPreference extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: Object, required: true })
  preferences: {
    marketing: boolean;
    newsletter: boolean;
    updates: boolean;
    frequency: Frequency;
    channels: ChannelPreferences;
  };

  @Prop({ required: true })
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserPreferenceSchema = SchemaFactory.createForClass(UserPreference);
