import { Box, Link, Breadcrumbs, Typography, Card, CardContent, Grid } from "@mui/material";
import moment from "moment";
import { NavLink } from "react-router-dom";
import ConditionalView from "../../components/ConditionalView";
import IncomingEventView from "../../components/IncomingEventView";
import ListView from "../../components/ListView";
import Page from "../../components/Page";
import PageLoader from "../../components/PageLoader";
import IncomingPlanning from "../../models/planning/IncomingPlanning";
import Planning from "../../models/planning/Planning";
import Team from "../../models/team/Team";
import panelDashboard from '../../resources/styles/layouts/WorkspaceDashboard';
import paths from '../../routings/paths.json';
import { preparePath } from "../../utils/PathUtil";

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    workspace?: Team,
    loaded: boolean,
    incoming?: IncomingPlanning
    scheduled: Planning[],
    page: number,
    pagesTotal: number,
    onPageChange: (page: number) => void
};

const IncomingPlanningsPage = ({ 
    strings, 
    workspace,
    loaded,
    incoming,
    scheduled,
    page,
    pagesTotal,
    onPageChange
}: Props) => {
    const panelClasses = panelDashboard();
    return (
        <Page title={strings('/plannings/incoming-title')}>
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
                                    paths.app.workspaces.planning.index.path,
                                    { 
                                        workspaceId: workspace?.id
                                    }
                                )
                            }
                        >
                            {strings('/plannings/breadcrumbs/index')}
                        </Link>
                        <Typography className={panelClasses.currentBreadcrumbsItem}>
                            {strings('/plannings/breadcrumbs/incoming')}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/plannings/incoming-title')}
                    </Typography>
                </Box>
            </Box>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <Grid container direction="column" justifyContent="center" spacing={6}>
                    <Grid item xl={4} lg={4} md={8} sm={12} xs={12}>
                        <IncomingEventView
                            strings={strings}
                            event={incoming?.data}
                            scheduled={incoming?.scheduled}
                            createUrl={
                                preparePath(
                                    paths.app.workspaces.planning.create.path,
                                    { workspaceId: workspace?.id }
                                )
                            }
                        />
                    </Grid>
                    <ConditionalView condition={scheduled.length > 0}> 
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <ListView
                                        title={strings('/plannings/all-scheduled')}
                                        data={scheduled}
                                        page={page}
                                        totalPages={pagesTotal}
                                        onPageChange={onPageChange}
                                        getRowTitle={planning => planning.title}
                                        getRowSubtitle={
                                            (planning) => 
                                                moment(planning.startDate).format('LLLL')
                                        }
                                        getActionHref={
                                            (planning) =>
                                                preparePath(
                                                    paths.app.workspaces.planning.details,
                                                    {
                                                        workspaceId: workspace?.id,
                                                        planningId: planning?.id
                                                    }
                                                )  
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </ConditionalView>
                </Grid>
            </ConditionalView>
        </Page>
    );
};

IncomingPlanningsPage.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    loaded: false,
    scheduled: [],
    page: 0,
    pagesTotal: 0,
    onPageChange: () => {}
}

export default IncomingPlanningsPage;
