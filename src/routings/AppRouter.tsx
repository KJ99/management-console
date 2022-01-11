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
                            <Route path={paths.app.workspaces.daily.day.path} element={<p>Coming soon...</p>} />
                            <Route path={paths.app.workspaces.daily.archive.path} element={<p>Coming soon...</p>} />
                            <Route path={paths.app.workspaces.planning.incoming.path} element={<p>Coming soon...</p>} />
                            <Route path={paths.app.workspaces.planning.create.path} element={<p>Coming soon...</p>} />
                            <Route path={paths.app.workspaces.planning.archive.path} element={<p>Coming soon...</p>} />
                            <Route path={paths.app.workspaces.retro.incoming.path} element={<p>Coming soon...</p>} />
                            <Route path={paths.app.workspaces.retro.create.path} element={<p>Coming soon...</p>} />
                            <Route path={paths.app.workspaces.retro.archive.path} element={<p>Coming soon...</p>} />
                            <Route path={paths.app.workspaces.retro.actions.path} element={<p>Coming soon...</p>} />
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