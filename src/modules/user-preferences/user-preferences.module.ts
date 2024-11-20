import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPreferencesController } from './controllers/user-preferences.controller';
import { UserPreferencesService } from './services/user-preferences.service';
import {
  UserPreference,
  UserPreferenceSchema,
} from './schemas/user-preference.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserPreference.name, schema: UserPreferenceSchema },
    ]),
  ],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
  exports: [UserPreferencesService],

})
export class UserPreferencesModule {}
