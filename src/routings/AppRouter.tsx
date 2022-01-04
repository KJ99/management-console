import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AnonymousView from '../components/AnonymousView';
import RestrictedView from '../components/RestrictedView';
import LoginView from '../views/LoginView';
import RegistrationView from '../views/RegistrationView';
import WorkspacesView from '../views/WorkspacesView';
import paths from './paths.json';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AnonymousView>
                <Routes>
                    <Route path={paths.index} element={<Navigate to={paths.auth.login} />} />
                    <Route path={paths.auth.register} element={<RegistrationView />}/>
                    <Route path={paths.auth.login} element={<LoginView />}/>
                    <Route path={paths.app.index} element={<Navigate to={paths.app.workspaces.index} />} />
                    <Route path="*" element={<p>Not Found Anon</p>} />
                </Routes>  
            </AnonymousView>
            <RestrictedView> 
                <Routes>
                    <Route path={paths.index} element={<Navigate to={paths.app.index} />} />
                    <Route path={paths.app.index} element={<Navigate to={paths.app.workspaces.index} />} />
                    <Route path={paths.app.workspaces.index} element={<WorkspacesView />} />
                    <Route path={paths.app.workspaces.dashboard} element={<p>Dashboard</p>} />
                    <Route path="*" element={<p>Not Found Restricted</p>} />
                </Routes>  
            </RestrictedView>  
        </BrowserRouter>
    );
}

export default AppRouter;