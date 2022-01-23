import { Box, Link, Breadcrumbs, Typography, Card, CardContent, Grid } from "@mui/material";
import moment from "moment";
import { NavLink } from "react-router-dom";
import ConditionalView from "../../components/ConditionalView";
import IncomingEventView from "../../components/IncomingEventView";
import ListView from "../../components/ListView";
import Page from "../../components/Page";
import PageLoader from "../../components/PageLoader";
import IncomingRetro from "../../models/retrospective/IncomingRetro";
import Retrospective from "../../models/retrospective/Retrospective";
import Team from "../../models/team/Team";
import panelDashboard from '../../resources/styles/layouts/WorkspaceDashboard';
import paths from '../../routings/paths.json';
import { preparePath } from "../../utils/PathUtil";

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    workspace?: Team,
    loaded: boolean,
    incoming?: IncomingRetro
    scheduled: Retrospective[],
    page: number,
    pagesTotal: number,
    onPageChange: (page: number) => void,
    onStart: () => void
};

const IncomingRetrospectivesPage = ({ 
    strings, 
    workspace,
    loaded,
    incoming,
    scheduled,
    page,
    pagesTotal,
    onPageChange,
    onStart
}: Props) => {
    const panelClasses = panelDashboard();
    return (
        <Page title={strings('/retro/incoming-title')}>
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
                                    paths.app.workspaces.retro.index.path,
                                    { 
                                        workspaceId: workspace?.id
                                    }
                                )
                            }
                        >
                            {strings('/retro/breadcrumbs/index')}
                        </Link>
                        <Typography className={panelClasses.currentBreadcrumbsItem}>
                            {strings('/retro/breadcrumbs/incoming')}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/retro/incoming-title')}
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
                                    paths.app.workspaces.retro.create.path,
                                    { workspaceId: workspace?.id }
                                )
                            }
                            onStart={onStart}
                        />
                    </Grid>
                    <ConditionalView condition={scheduled.length > 0}> 
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <ListView
                                        title={strings('/retro/all-scheduled')}
                                        data={scheduled}
                                        page={page}
                                        totalPages={pagesTotal}
                                        onPageChange={onPageChange}
                                        getRowTitle={retro => retro.title}
                                        getRowSubtitle={
                                            (retro) => 
                                                moment(retro.startDate).format('LLLL')
                                        }
                                        getActionHref={
                                            (retro) =>
                                                preparePath(
                                                    paths.app.workspaces.retro.details,
                                                    {
                                                        workspaceId: workspace?.id,
                                                        retroId: retro?.id
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

IncomingRetrospectivesPage.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    loaded: false,
    scheduled: [],
    page: 0,
    pagesTotal: 0,
    onPageChange: () => {},
    onStart: () => {}
}

export default IncomingRetrospectivesPage;
