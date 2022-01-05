import { ListAlt, PeopleAlt, ThumbsUpDown, Today } from "@mui/icons-material";
import moment from "moment";
import { INavElement } from "../components/nav/NavElement";
import paths from '../routings/paths.json';
import { preparePath } from "./PathUtil";

const createNav = (workspaceId: any): INavElement[] => [
    {
        label: 'My Workspace',
        icon: PeopleAlt,
        href: preparePath(paths.app.workspaces.details.path, { workspaceId }),
        pattern: paths.app.workspaces.details.pattern,
        depth: 0,
        children: []
    },
    {
        label: 'Daily Helper',
        icon: Today,
        pattern: paths.app.workspaces.daily.pattern,
        depth: 0,
        children: [
            {
                label: 'Today Reports',
                href: preparePath(
                    paths.app.workspaces.daily.day.path,
                    { 
                        workspaceId, 
                        day: moment().format('YYYY-MM-DD') 
                    }
                ),
                pattern: paths.app.workspaces.daily.day.pattern,
                depth: 1,
                children: []
            },
            {
                label: 'Archive',
                href: preparePath(paths.app.workspaces.daily.archive.path, { workspaceId }),
                pattern: paths.app.workspaces.daily.archive.pattern,
                depth: 1,
                children: []
            },
        ]
    },
    {
        label: 'Planning Poker',
        icon: ListAlt,
        pattern: paths.app.workspaces.planning.pattern,
        depth: 0,
        children: [
            {
                label: 'Create',
                href: preparePath(paths.app.workspaces.planning.create.path, { workspaceId }),
                pattern: paths.app.workspaces.planning.create.pattern,
                depth: 1,
                children: []
            },
            {
                label: 'Incoming',
                href: preparePath(paths.app.workspaces.planning.incoming.path, { workspaceId }),
                pattern: paths.app.workspaces.planning.incoming.pattern,
                depth: 1,
                children: []
            },
            {
                label: 'Archive',
                href: preparePath(paths.app.workspaces.planning.archive.path, { workspaceId }),
                pattern: paths.app.workspaces.planning.archive.pattern,
                depth: 1,
                children: []
            },
        ]
    },
    {
        label: 'Retro Helper',
        icon: ThumbsUpDown,
        pattern: paths.app.workspaces.retro.pattern,
        depth: 0,
        children: [
            {
                label: 'Create',
                href: preparePath(paths.app.workspaces.retro.create.path, { workspaceId }),
                pattern: paths.app.workspaces.retro.create.pattern,
                depth: 1,
                children: []
            },
            {
                label: 'Incoming',
                href: preparePath(paths.app.workspaces.retro.incoming.path, { workspaceId }),
                pattern: paths.app.workspaces.retro.incoming.pattern,
                depth: 1,
                children: []
            },
            {
                label: 'Archive',
                href: preparePath(paths.app.workspaces.retro.archive.path, { workspaceId }),
                pattern: paths.app.workspaces.retro.archive.pattern,
                depth: 1,
                children: []
            },
            {
                label: 'Action Items',
                href: preparePath(paths.app.workspaces.retro.actions.path, { workspaceId }),
                pattern: paths.app.workspaces.retro.actions.pattern,
                depth: 1,
                children: []
            },
        ]
    }
];

export default createNav;