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
import Retrospective from "../../models/retrospective/Retrospective";

export type Props = {
    strings: (name: any, ...args: any[]) => string
    loaded: boolean,
    data: Retrospective[],
    page: number,
    pagesTotal: number,
    workspace?: Team,
    onPageChange: (page: number) => void
}

const RetrospectivesArchivePage = ({
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
        <Page title={strings('/retro/archive-title')}>
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
                            {strings('/retro/archive')}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/retro/archive-title')}
                    </Typography>
                </Box>
            </Box>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <Card>
                    <CardContent>
                        <ListView
                            title={strings('/retro/completed-retrospectives')}
                            data={data}
                            getRowTitle={(retro) => retro.title}
                            getRowSubtitle={(retro) => moment(retro.startDate).format('LLLL')}
                            page={page}
                            totalPages={pagesTotal}
                            onPageChange={onPageChange}
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
            </ConditionalView>
        </Page>
    );
}

RetrospectivesArchivePage.defaultProps ={
    strings: (name: any, ...args: any[]) => '',
    loaded: false,
    data: [],
    page: 0,
    pagesTotal: 0,
    onPageChange: (page: number) => {}
}

export default RetrospectivesArchivePage;