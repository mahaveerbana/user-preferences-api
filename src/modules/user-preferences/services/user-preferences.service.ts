import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreference } from '../schemas/user-preference.schema';
import { CreateUserPreferenceDto, Response, UpdateUserPreferenceDto } from '../dto/user-preference.dto';
import { UserPreferenceResponseDto } from '../dto/user-preference.dto';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectModel(UserPreference.name) private model: Model<UserPreference>,
  ) {}

  // Create User Preference
  async create(preferenceData: CreateUserPreferenceDto): Promise<Response<UserPreferenceResponseDto>> {
    try {
      // Check if user preferences already exist
      const existingPreference = await this.model.findOne({ userId: preferenceData.userId });
      if (existingPreference) {
        throw new BadRequestException('Preferences for this user already exist');
      }

      // Creating a new preference
      const preference = new this.model(preferenceData);
      const savedPreference = await preference.save();

      // Return success response
      return {
        status: 'success',
        message: 'User preferences created successfully',
        data: this.mapToResponseDto(savedPreference),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Find user preferences by userId
  async findByUserId(userId: string): Promise<Response<UserPreferenceResponseDto>> {
    try {
      const preference = await this.model.findOne({ userId });
      if (!preference) {
        throw new NotFoundException('User preferences not found');
      }
      return {
        status: 'success',
        message: 'User preferences found successfully',
        data: this.mapToResponseDto(preference),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Update user preferences
  async update(userId: string, updateData: UpdateUserPreferenceDto): Promise<Response<UserPreferenceResponseDto>> {
    try {
      const preference = await this.model.findOne({ userId });
      if (!preference) {
        throw new NotFoundException('User preferences not found');
      }

      // Update the preferences
      Object.assign(preference, updateData);
      const updatedPreference = await preference.save();

      return {
        status: 'success',
        message: 'User preferences updated successfully',
        data: this.mapToResponseDto(updatedPreference),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Delete user preferences
  async delete(userId: string): Promise<Response<null>> {
    try {
      const preference = await this.model.findOne({ userId });
      if (!preference) {
        throw new NotFoundException('User preferences not found');
      }

      // Delete the preference
      await this.model.deleteOne({ userId });

      return {
        status: 'success',
        message: 'User preferences deleted successfully',
        data: null,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Helper method to map the user preference model to the response DTO
  private mapToResponseDto(preference: UserPreference): UserPreferenceResponseDto {
    return {
      userId: preference.userId,
      email: preference.email,
      preferences: preference.preferences,
      timezone: preference.timezone,
      createdAt: preference.createdAt,
      updatedAt: preference.updatedAt,
    };
  }

  // Error handling method to return consistent error responses
  private handleError(error: any): Response<null> {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      return {
        status: 'error',
        message: error.message,
        error: error.message,
      };
    }

    // Catch any unexpected errors
    return {
      status: 'error',
      message: 'An unexpected error occurred',
      error: error.message || 'Unknown error',
    };
  }
}
