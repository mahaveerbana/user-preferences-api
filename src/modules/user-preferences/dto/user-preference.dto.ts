import { IsString, IsEmail, IsEnum, IsObject, IsNotEmpty, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { Frequency, ChannelPreferences } from '../schemas/user-preference.schema';

// Preferences DTO
class PreferencesDto {
  @IsBoolean()
  marketing: boolean;

  @IsBoolean()
  newsletter: boolean;

  @IsBoolean()
  updates: boolean;

  @IsEnum(Frequency, {
    message: 'Frequency must be one of: daily, weekly, monthly, or never',
  })
  frequency: Frequency;

  @ValidateNested() 
  @IsObject()
  channels: ChannelPreferences;
}

// Create User Preference DTO
export class CreateUserPreferenceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested()  
  @IsObject()
  @IsNotEmpty()
  preferences: PreferencesDto;

  @IsString()
  @IsNotEmpty()
  timezone: string;
}

// Update User Preference DTO
export class UpdateUserPreferenceDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateNested() 
  @IsObject()
  preferences?: PreferencesDto;

  @IsOptional()
  @IsString()
  timezone?: string;
}

// User Preference Response DTO
export class UserPreferenceResponseDto {
  userId: string;
  email: string;
  preferences: PreferencesDto;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface Response<T> {
    status: string;
    message: string;
    data?: T;
    error?: string;
  }
  