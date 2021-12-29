import LoginPage from "../pages/auth/LoginPage";
import LoginViewModel from "../view-models/auth/LoginViewModel";

const LoginView = () => {
    return (
        <LoginViewModel>
            <LoginPage />
        </LoginViewModel>
    );
}

export default LoginView;