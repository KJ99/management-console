import { createMapper, mapFrom, mapWith } from '@automapper/core';
import { classes } from '@automapper/classes';
import ProfileSettings from '../models/profile/ProfileSettings';
import SettingsUpdateModel from '../models/update/SettingsUpdateModel';
import User from '../models/profile/User';
import ProfileUpdateModel from '../models/update/ProfileUpdateModel';
import UserSettingsUpdateModel from '../models/update/UserSettingsUpdateModel';

export const mapper = createMapper({
    name: 'auto-mapper',
    pluginInitializer: classes
});

mapper.createMap(ProfileSettings, SettingsUpdateModel);
mapper.createMap(User, ProfileUpdateModel);
mapper.createMap(User, SettingsUpdateModel)
    .forMember(
        (dest) => dest.nightMode,
        mapFrom((src) => src.settings?.nightMode)
    );

mapper.createMap(User, UserSettingsUpdateModel)
    .forMember(
        (dest) => dest.settings,
        mapWith(SettingsUpdateModel, ProfileSettings, (src) => src.settings)
    );