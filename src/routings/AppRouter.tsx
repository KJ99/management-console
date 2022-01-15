import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AnonymousView from '../components/AnonymousView';
import RestrictedView from '../components/RestrictedView';
import LoginView from '../views/LoginView';
import RegistrationView from '../views/RegistrationView';
import WorkspaceDashboard from '../layouts/WorkspaceDashboard';
import WorkspaceDetailsView from '../views/WorkspaceDetailsView';
import WorkspacesView from '../views/WorkspacesView';
import paths from './paths.json';
import AppLayout from '../layouts/AppLayout';
import ProfileView from '../views/ProfileView';
import ConfigureDailyView from '../views/daily/ConfigureDailyView';
import DailyReportsView from '../views/daily/DailyReportsView';
import DailyArchiveView from '../views/daily/DailyArchiveView';
import PlanningCreateView from '../views/plannings/PlanningCreateView';
import IncomingPlanningsView from '../views/plannings/IncomingPlanningsView';
import PlanningsArchiveView from '../views/plannings/PlanningsArchiveView';
import PlanningDetailsView from '../views/plannings/PlanningDetailsView';
import RetrospectiveCreateView from '../views/retrospectives/RetrospectiveCreateView';
import IncomingRetrospectivesView from '../views/retrospectives/IncomingRetrospectivesView';
import RetrospectivesArchiveView from '../views/retrospectives/RetrospectivesArchiveView';
import ActionItemsView from '../views/retrospectives/ActionItemsView';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AnonymousView>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route path={paths.index} element={<Navigate to={paths.auth.login} />} />
                        <Route path={paths.auth.register} element={<RegistrationView />}/>
                        <Route path={paths.auth.login} element={<LoginView />}/>
                        <Route path="*" element={<p>Not Found Anon</p>} />
                    </Route>
                </Routes>  
            </AnonymousView>
            <RestrictedView>  
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route path={paths.index} element={<Navigate to={paths.app.index} />} />
                        <Route path={paths.app.index} element={<Navigate to={paths.app.workspaces.index} />} />
                        <Route path={paths.app.workspaces.index} element={<WorkspacesView />} />
                        <Route path={paths.app.profile.details} element={<ProfileView />} />
                        <Route path={paths.app.workspaces.dashboard} element={<WorkspaceDashboard />}>
                            <Route 
                                path="" 
                                element={<Navigate to={paths.app.workspaces.dashboardIndexRedirect} replace />} 
                            />
                            <Route path={paths.app.workspaces.details.path} element={<WorkspaceDetailsView />} />
                            <Route path={paths.app.workspaces.daily.day.path} element={<DailyReportsView />} />
                            <Route path={paths.app.workspaces.daily.configure.path} element={<ConfigureDailyView />} />
                            <Route path={paths.app.workspaces.daily.archive.path} element={<DailyArchiveView />} />
                            <Route path={paths.app.workspaces.planning.incoming.path} element={<IncomingPlanningsView />} />
                            <Route path={paths.app.workspaces.planning.create.path} element={<PlanningCreateView />} />
                            <Route path={paths.app.workspaces.planning.archive.path} element={<PlanningsArchiveView />} />
                            <Route path={paths.app.workspaces.planning.details} element={<PlanningDetailsView />} />
                            <Route path={paths.app.workspaces.retro.incoming.path} element={<IncomingRetrospectivesView />} />
                            <Route path={paths.app.workspaces.retro.create.path} element={<RetrospectiveCreateView />} />
                            <Route path={paths.app.workspaces.retro.archive.path} element={<RetrospectivesArchiveView />} />
                            <Route path={paths.app.workspaces.retro.actions.path} element={<ActionItemsView />} />
                            <Route path="*" element={<p>Not found dashboard</p>} />
                        </Route>
                        <Route path={'*'} element={<p>not found restricted</p>} />
                    </Route>
                </Routes>
            </RestrictedView>
        </BrowserRouter>
    );
}

export default AppRouter;