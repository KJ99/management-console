import { FC } from "react";
import RegistrationPage from "../pages/auth/RegistrationPage";
import RegistrationViewModel from "../view-models/auth/RegistrationViewModel";

const RegistrationView: FC = () => {
    return (
        <RegistrationViewModel>
            <RegistrationPage />
        </RegistrationViewModel>
    );
}

export default RegistrationView;