import {  } from 'react-router';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginView from '../views/LoginView';
import RegistrationView from '../views/RegistrationView';
import paths from './paths.json';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={paths.auth.register} element={<RegistrationView />}/>
                <Route path={paths.auth.login} element={<LoginView />}/>
                <Route path="*" element={<p>Not Found</p>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;