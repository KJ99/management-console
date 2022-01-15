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
import ActionItem from "../../models/retrospective/ActionItem";

export type Props = {
    strings: (name: any, ...args: any[]) => string
    loaded: boolean,
    data: Retrospective[],
    workspace?: Team,
    onMarkAsCompleted: (item: ActionItem) => void
}

const ActionItemsPage = ({
    strings,
    loaded,
    data,
    workspace,
    onMarkAsCompleted
}: Props) => {
    const panelClasses = panelDashboard();
    return (
        <Page title={strings('/retro/action-items-title')}>
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
                            {strings('/retro/action-items')}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/retro/action-items-title')}
                    </Typography>
                </Box>
            </Box>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <Card>
                    <CardContent>
                        <ListView
                            title={strings('/retro/workspace-action-items', workspace?.name)}
                            data={data}
                            getRowTitle={(retro) => retro.title}
                            getRowSubtitle={(retro) => moment(retro.startDate).format('LLLL')}
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

ActionItemsPage.defaultProps ={
    strings: (name: any, ...args: any[]) => '',
    loaded: false,
    data: [],
    onMarkAsCompleted: (_: ActionItem) => {}
}

export default ActionItemsPage;