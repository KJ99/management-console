import { Box, Link, Breadcrumbs, Typography, Card, CardContent, Grid } from "@mui/material";
import { FormikProps } from "formik";
import { NavLink } from "react-router-dom";
import RetrospectiveForm, { RetrospectiveFormModel } from "../../components/forms/RetrospectiveForm";
import Page from "../../components/Page";
import Team from "../../models/team/Team";
import panelDashboard from '../../resources/styles/layouts/WorkspaceDashboard';
import paths from '../../routings/paths.json';
import { preparePath } from "../../utils/PathUtil";

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    workspace?: Team,
    formik: FormikProps<RetrospectiveFormModel>
};

const RetrospectiveCreatePage = ({ strings, workspace, formik }: Props) => {
    const panelClasses = panelDashboard();
    return (
        <Page title={strings('/retro/create-title')}>
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
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/retro/create-title')}
                    </Typography>
                </Box>
            </Box>
            <Grid container justifyContent="center">
                <Grid item xl={5} lg={5} md={8} sm={12} xs={12}>
                    <Card>
                        <CardContent>
                            <RetrospectiveForm
                                strings={strings}
                                formik={formik}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Page>
    );
};

RetrospectiveCreatePage.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    formik: {}
}

export default RetrospectiveCreatePage;
