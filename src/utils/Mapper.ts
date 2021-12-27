import { createMapper, mapFrom, mapWith } from '@automapper/core';
import { classes } from '@automapper/classes';
import ProfileSettings from '../models/profile/ProfileSettings';
import User from '../models/profile/User';
import ProfileUpdateModel from '../models/profile/ProfileUpdateModel';
import UserSettingsUpdateModel from '../models/profile/UserSettingsUpdateModel';
import SettingsUpdateModel from '../models/profile/SettingsUpdateModel';
import Team from '../models/team/Team';
import TeamUpdateModel from '../models/team/TeamUpdateModel';
import TeamSettings from '../models/team/TeamSettings';
import TeamSettingsUpdateModel from '../models/team/TeamSettingsUpdateModel';
import Member from '../models/member/Member';
import MemberUpdateModel from '../models/member/MemberUpdateModel';
import Planning from '../models/planning/Planning';
import PlanningUpdateModel from '../models/planning/PlanningUpdateModel';
import PlanningItem from '../models/planning/PlanningItem';
import PlanningItemUpdateModel from '../models/planning/PlanningItemUpdateModel';
import Retrospective from '../models/retrospective/Retrospective';
import RetrospectiveUpdateModel from '../models/retrospective/RetrospectiveUpdateModel';
import Answer from '../models/retrospective/Answer';
import AnswerUpdateModel from '../models/retrospective/AnswerUpdateModel';
import ActionItem from '../models/retrospective/ActionItem';
import ActionItemUpdateModel from '../models/retrospective/ActionItemUpdateModel';
import RetroConfig from '../models/retrospective/RetroConfig';
import RetroConfigUpdateModel from '../models/retrospective/RetroConfigUpdateModel';
import DailyConfig from '../models/daily/DailyConfig';
import DailyConfigUpdateModel from '../models/daily/DailyConfigUpdateModel';

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

mapper.createMap(Team, TeamUpdateModel)
    .forMember(
        (dest) => dest.settings,
        mapWith(TeamSettingsUpdateModel, TeamSettings, (src) => src.settings)
    );

mapper.createMap(TeamSettings, TeamSettingsUpdateModel);

mapper.createMap(Member, MemberUpdateModel)
    .forMember(
        (dest) => dest.roles,
        mapFrom((src) => src.roles?.map((role) => role.code) ?? [])
    );

mapper.createMap(Planning, PlanningUpdateModel);
mapper.createMap(PlanningItem, PlanningItemUpdateModel);
mapper.createMap(RetroConfig, RetroConfigUpdateModel)
    .forMember(
        (dest) => dest.votes,
        mapFrom((src) => src.memberVotes)
    );
mapper.createMap(Retrospective, RetrospectiveUpdateModel)
    .forMember(
        (dest) => dest.config,
        mapWith(RetroConfigUpdateModel, RetroConfig, (src) => src.configuration)
    );
mapper.createMap(Answer, AnswerUpdateModel)
    .forMember(
        (dest) => dest.childrenIds,
        mapFrom((src) => src.children?.map((child) => child.id) ?? [])
    );
mapper.createMap(ActionItem, ActionItemUpdateModel);
mapper.createMap(DailyConfig, DailyConfigUpdateModel);