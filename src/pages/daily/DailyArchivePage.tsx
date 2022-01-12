import { Box, Breadcrumbs, Card, CardContent, Link, Typography } from "@mui/material";
import Page from "../../components/Page";
import Team from "../../models/team/Team";
import panelDashboard from '../../resources/styles/layouts/WorkspaceDashboard';
import paths from '../../routings/paths.json';
import { preparePath } from "../../utils/PathUtil";
import { NavLink } from "react-router-dom";
import moment from "moment";
import ListView from "../../components/ListView";
import ConditionalView from "../../components/ConditionalView";
import PageLoader from "../../components/PageLoader";
import { ReactElement } from "react";

export type Props = {
    strings: (name: any, ...args: any[]) => string
    loaded: boolean,
    days: string[],
    page: number,
    pagesTotal: number,
    workspace?: Team,
    onPageChange: (page: number) => void
}

const DailyArchivePage = ({
    strings,
    loaded,
    days,
    page,
    pagesTotal,
    workspace,
    onPageChange
}: Props) => {
    const panelClasses = panelDashboard();
    return (
        <Page title={strings('/daily/archive-title')}>
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
                            {strings('/daily/breadcrumbs/archive')}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/daily/archive-title')}
                    </Typography>
                </Box>
            </Box>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <Card>
                    <CardContent>
                        <ListView
                            title={strings('/daily/available-days')}
                            data={days}
                            getRowTitle={(val) => val}
                            getRowSubtitle={(val) => 'Chujdupa'}
                            page={page}
                            totalPages={pagesTotal}
                            onPageChange={onPageChange}
                            getActionHref={
                                (day) =>
                                    preparePath(
                                        paths.app.workspaces.daily.day.path, 
                                        { 
                                            workspaceId: workspace?.id,
                                            day
                                        }
                                    )
                                }
                        />
                    </CardContent>
                </Card>
            </ConditionalView>
        </Page>
    );
}

DailyArchivePage.defaultProps ={
    strings: (name: any, ...args: any[]) => '',
    loaded: false,
    days: [],
    page: 0,
    pagesTotal: 0,
    onPageChange: (page: number) => {}
}

export default DailyArchivePage;