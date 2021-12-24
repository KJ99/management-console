import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import ProfileSettings from '../models/profile/ProfileSettings';
import ProfileSettingsUpdateModel from '../models/update/ProfileSettingsUpdateModel';
import User from '../models/profile/User';
import UserUpdateModel from '../models/update/UserUpdateModel';

export const mapper = createMapper({
    name: 'auto-mapper',
    pluginInitializer: classes
});

mapper.createMap(ProfileSettings, ProfileSettingsUpdateModel);
mapper.createMap(User, UserUpdateModel);