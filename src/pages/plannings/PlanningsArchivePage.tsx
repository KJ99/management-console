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
import Planning from "../../models/planning/Planning";

export type Props = {
    strings: (name: any, ...args: any[]) => string
    loaded: boolean,
    data: Planning[],
    page: number,
    pagesTotal: number,
    workspace?: Team,
    onPageChange: (page: number) => void
}

const PlanningsArchivePage = ({
    strings,
    loaded,
    data,
    page,
    pagesTotal,
    workspace,
    onPageChange
}: Props) => {
    const panelClasses = panelDashboard();
    return (
        <Page title={strings('/plannings/archive-title')}>
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
                            {strings('/plannings/archive')}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/plannings/archive-title')}
                    </Typography>
                </Box>
            </Box>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <Card>
                    <CardContent>
                        <ListView
                            title={strings('/plannings/completed-plannings')}
                            data={data}
                            getRowTitle={(planning) => planning.title}
                            getRowSubtitle={(planning) => moment(planning.startDate).format('LLLL')}
                            page={page}
                            totalPages={pagesTotal}
                            onPageChange={onPageChange}
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
            </ConditionalView>
        </Page>
    );
}

PlanningsArchivePage.defaultProps ={
    strings: (name: any, ...args: any[]) => '',
    loaded: false,
    data: [],
    page: 0,
    pagesTotal: 0,
    onPageChange: (page: number) => {}
}

export default PlanningsArchivePage;