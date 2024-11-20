import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { UserPreferencesService } from '../services/user-preferences.service';
import { CreateUserPreferenceDto, Response, UpdateUserPreferenceDto } from '../dto/user-preference.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('api/preferences')
export class UserPreferencesController {
  constructor(private readonly service: UserPreferencesService) {}

  @Post()
  createPreference(
    @Body(new ValidationPipe()) preferenceData: CreateUserPreferenceDto,
  ): Promise<Response<any>> {
    return this.service.create(preferenceData);
  }

  @Get(':userId')
  getPreference(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Patch(':userId')
  updatePreference(
    @Param('userId') userId: string,
    @Body(new ValidationPipe()) updateData: UpdateUserPreferenceDto,
  ) {
    return this.service.update(userId, updateData);
  }

  @Delete(':userId')
  deletePreference(@Param('userId') userId: string) {
    return this.service.delete(userId);
  }
}
