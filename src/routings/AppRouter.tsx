import {  } from 'react-router';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegistrationView from '../views/RegistrationView';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<RegistrationView />}/>
                <Route path="*" element={<p>Not Found</p>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;