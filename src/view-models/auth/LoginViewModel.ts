import { FormikHelpers, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Children, cloneElement, ReactNode, useCallback, useContext, useState } from "react";
import { IVerificationFormValues, VerificationFormValues } from "../../components/forms/AccountVerificationForm";
import { LoginFormModel } from "../../components/forms/LoginForm";
import { AuthContext } from "../../contexts/AuthContext";
import { StringsContext } from "../../contexts/StringsContext";
import BadRequestError from "../../infrastructure/api/exceptions/BadRequestError";
import ForbiddenError from "../../infrastructure/api/exceptions/ForbiddenError";
import AccountClient from "../../infrastructure/clients/identity-server/AccountClient";
import AuthClient from "../../infrastructure/clients/identity-server/AuthClient";
import VerifyAccountModel from "../../models/account/VerifyAccountModel";
import LoginModel from "../../models/auth/LoginModel";
import { processFormError } from "../../utils/ErrorProcessor";
import { mapper } from "../../utils/Mapper";
import { ViewModelProps } from "../ViewModelProps";
import paths from '../../routings/paths.json';
import { useNavigate } from "react-router";

const LoginViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const { enqueueSnackbar } = useSnackbar();
    const [verificationToken, setVerificationToken] = useState<string|undefined>();
    const [verificationResending, setVerificationResending] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(false);
    const [username, setUsername] = useState('');
    const { authenticate } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = useCallback(
        (values: LoginFormModel, helpers: FormikHelpers<LoginFormModel>) => {
            const model = mapper.map(values, LoginModel, LoginFormModel);
            const client = new AuthClient();
            client.login(model)
                .then((result) => {
                    authenticate(result);
                    navigate(paths.app.index)
                })
                .catch((e) => {
                    if(e instanceof BadRequestError) {
                        helpers.setErrors({ submit: strings('/login/bad-credentials') });
                    } else if (e instanceof ForbiddenError && e.additionalData?.verificationToken != null) {
                        setVerificationToken(e.additionalData?.verificationToken);
                        setUsername(values.username);
                    } else {
                        enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' });
                    }
                })
                .finally(() => helpers.setSubmitting(false))
        },
        [strings, enqueueSnackbar]
    );
    const loginFormik = useFormik<LoginFormModel>({
        initialValues: {
            username: '',
            password: '',
            submit: null
        },
        onSubmit: handleLogin
    });

    const handleVerifyAccount = useCallback(
        (values: IVerificationFormValues, helpers: FormikHelpers<IVerificationFormValues>) => {
            const model = mapper.map(values, VerifyAccountModel, VerificationFormValues);
            model.token = verificationToken;
            const client = new AccountClient();
            client.verifyAccount(model)
                .then(() => setVerified(true))
                .catch((e) => {
                    if (e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' });
                    }
                })
                .finally(() => helpers.setSubmitting(false))
        },
        [verificationToken, enqueueSnackbar, strings]
    );

    const verificationFormik = useFormik<IVerificationFormValues>({
        initialValues: {
            pin: ''
        },
        onSubmit: handleVerifyAccount
    });

    const handleVerificationResend = useCallback(
        () => {
            setVerificationResending(true);
            const client = new AccountClient();
            client.resendVerification({ email: username })
                .then((verification) => {
                    setVerificationToken(verification.verificationToken);
                    enqueueSnackbar(strings('/verification/resend-success'), { variant: 'success' });
                })
                .catch(() => enqueueSnackbar(strings('/verification/resend-fail'), { variant: 'error' }))
                .finally(() => setVerificationResending(false));
        }, 
        [username, enqueueSnackbar, strings]
    );

    const handleReset = useCallback(() => {
        verificationFormik.resetForm();
        loginFormik.resetForm();
        setVerified(false);
        setVerificationToken(undefined);
    }, [loginFormik, verificationFormik]);

    return Children.only(
        cloneElement(
            children, 
            {
                strings,
                loginFormik,
                verificationFormik,
                needsVerification: verificationToken != null,
                verificationResending,
                onVerificationResend: handleVerificationResend,
                verified,
                onReset: handleReset
            }
        )
    );
}

export default LoginViewModel;