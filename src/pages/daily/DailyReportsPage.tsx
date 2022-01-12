import { Box, Breadcrumbs, Grid, Link, List, ListItem, Typography } from "@mui/material";
import moment from "moment";
import { useCallback, useMemo } from "react";
import { NavLink } from "react-router-dom";
import NotesColumn from "../../components/NotesColumn";
import Page from "../../components/Page";
import ProfilePicture from "../../components/ProfilePicture";
import MemberReport from "../../models/daily/MemberReport";
import Member from "../../models/member/Member";
import Profile from "../../models/profile/Profile";
import Team from "../../models/team/Team";
import panelDashboard from '../../resources/styles/layouts/WorkspaceDashboard';
import paths from '../../routings/paths.json';
import { preparePath } from "../../utils/PathUtil";
import styleSheet from '../../resources/styles/pages/daily/DailyReportsPage';
import { v4 } from "uuid";
import ConditionalView from "../../components/ConditionalView";
import PageLoader from "../../components/PageLoader";

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    day: string,
    reports: MemberReport[],
    loaded: boolean,
    members: Member[],
    workspace?: Team
};

interface IPartialReport {
    user?: Profile,
    report?: string
}

const reportsOfType = (reports: any[], type: string): IPartialReport[] => {
    return reports.map((report) => ({
        user: report.user,
        report: report?.report != null ? report.report[type] ?? null : null
    })).filter((element) => element.report != null);
}

type MediaProps = {
    user?: Profile
}

const ReportMedia = ({ user }: MediaProps) => {
    return (
        <ProfilePicture
            user={user}
            variant="normal"
        />
    )
}

const membersWithoutReports = (reports: MemberReport[], allMembers: Member[]): Member[] => {
    return allMembers.filter(
        (member) => reports
            .map((report) => report.user)
            .find((user) => user?.id === member.userId) == null 
    );
}

const DailyReportsPage = ({
    strings,
    reports,
    loaded,
    members,
    workspace,
    day
}: Props) => {
    const panelClasses = panelDashboard();
    const classes = styleSheet();
    const dayLabel = useMemo(() => {
        const today = moment().format('YYYY-MM-DD');
        return today === day ? strings('/daily/today') : day
    }, [day]);

    const getReportTitle = useCallback(
        (data: any) => {
            const firstName = data?.user?.firstName ?? '';
            const lastName = data?.user?.lastName ?? '';
            return `${firstName} ${lastName}`;
        },
        []
    ); 
    const getReportContent = useCallback((data: any) => data?.report, []);

    return (
        <Page title={strings('/daily/reports-title', dayLabel)}>
            <Box className={panelClasses.pageHeader}>
                <Box className={panelClasses.pageTitleArea}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link 
                            className={panelClasses.breadcrumbsItem} 
                            component={NavLink} 
                            to={paths.app.workspaces.index}
                        >
                            {strings('/workspaces/title')}
                        </Link>
                        <Link 
                            className={panelClasses.breadcrumbsItem} 
                            component={NavLink} 
                            to={
                                preparePath(
                                    paths.app.workspaces.details.path, 
                                    { 
                                        workspaceId: workspace?.id
                                    }
                                )
                            }
                        >
                            {workspace?.name}
                        </Link>
                        <Link 
                            className={panelClasses.breadcrumbsItem} 
                            component={NavLink} 
                            to={
                                preparePath(
                                    paths.app.workspaces.daily.day.path, 
                                    { 
                                        workspaceId: workspace?.id,
                                        day: moment().format('YYYY-MM-DD')
                                    }
                                )
                            }
                        >
                            {strings('/daily/breadcrumbs/index')}
                        </Link>
                        <Typography className={panelClasses.currentBreadcrumbsItem}>
                            {day}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/daily/reports-title', dayLabel)}
                    </Typography>
                </Box>
            </Box>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <>
                    <Grid container spacing={12}>
                        <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                            <NotesColumn
                                title={strings('/daily/last-time')}
                                notes={reportsOfType(reports, 'lastTime')}
                                getNoteTitle={getReportTitle}
                                getNoteContent={getReportContent}
                                renderNoteMedia={(note) => <ReportMedia user={note?.user} />}
                            />
                        </Grid>
                        <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                            <NotesColumn
                                title={strings('/daily/today')}
                                notes={reportsOfType(reports, 'today')}
                                getNoteTitle={getReportTitle}
                                getNoteContent={getReportContent}
                                renderNoteMedia={(note) => <ReportMedia user={note?.user} />}
                            />
                        </Grid>
                        <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                            <NotesColumn
                                title={strings('/daily/problems')}
                                notes={reportsOfType(reports, 'problem')}
                                getNoteTitle={getReportTitle}
                                getNoteContent={getReportContent}                        
                                renderNoteMedia={(note) => <ReportMedia user={note?.user} />}
                            />
                        </Grid>
                    </Grid>
                    <Typography className={classes.membersWithoutReportLabel}>
                        {strings('/daily/members-without-reports')}
                    </Typography>
                    <List>
                        {membersWithoutReports(reports, members).map((member) => (
                            <ListItem key={v4()}>
                                {member.firstName} {member.lastName}
                            </ListItem>
                        ))}
                    </List>
                </>
            </ConditionalView>
        </Page>
    );
};

DailyReportsPage.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    reports: [],
    loaded: false,
    members: [],
    day: '',
    workspace: null
};

export default DailyReportsPage;
