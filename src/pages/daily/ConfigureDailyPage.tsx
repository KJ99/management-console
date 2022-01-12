import { Box, Breadcrumbs, Card, CardContent, Grid, Link, Typography } from "@mui/material";
import { FormikProps } from "formik";
import moment from "moment";
import { NavLink } from "react-router-dom";
import ConditionalView from "../../components/ConditionalView";
import DailyConfigurationForm, { DailyConfigFormModel } from "../../components/forms/DailyConfigurationForm";
import Page from "../../components/Page";
import PageLoader from "../../components/PageLoader";
import Team from "../../models/team/Team";
import panelDashboard from '../../resources/styles/layouts/WorkspaceDashboard';
import paths from '../../routings/paths.json';
import { preparePath } from "../../utils/PathUtil";

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    formik: FormikProps<DailyConfigFormModel>,
    workspace?: Team,
    loaded: boolean
}

const ConfigureDailyPage = ({ strings, formik, workspace, loaded }: Props) => {
    const panelClasses = panelDashboard();
    return (
        <Page title={strings('/daily/configure')}>
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
                            {strings('/daily/breadcrumbs/configure')}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/daily/configure')}
                    </Typography>
                </Box>
            </Box>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <Grid container justifyContent="center">
                    <Grid item xs={4}>
                        <Card>
                            <CardContent>
                                <DailyConfigurationForm
                                    strings={strings}
                                    formik={formik}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ConditionalView>
        </Page>
    );
}

ConfigureDailyPage.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    formik: {},
    loaded: false
}

export default ConfigureDailyPage;