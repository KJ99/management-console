import { Children, cloneElement, ReactNode, useCallback, useContext, useState } from "react";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { useFormik, FormikProps, FormikHelpers } from 'formik';
import { ISignUpFormValues, SignUpFormValues } from "../../components/forms/SignUpForm";
import { mapper } from '../../utils/Mapper';
import AccountCreateModel from "../../models/account/AccountCreateModel";
import AccountClient from "../../infrastructure/clients/identity-server/AccountClient";
import BadRequestError from "../../infrastructure/api/exceptions/BadRequestError";
import ConflictError from "../../infrastructure/api/exceptions/ConflictError";
import { processFormError } from '../../utils/ErrorProcessor';
import * as Yup from 'yup';
import { IVerificationFormValues, VerificationFormValues } from "../../components/forms/AccountVerificationForm";
import { useSnackbar } from "notistack";
import VerifyAccountModel from "../../models/account/VerifyAccountModel";

const RegistrationViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [verificationToken, setVerificationToken] = useState<string|undefined>();
    const [verificationResending, setVerificationResending] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(false);
    const [email, setEmail] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const handleSignUpSubmit = useCallback(
        (values: ISignUpFormValues, helpers: FormikHelpers<ISignUpFormValues>) => {
            const model = mapper.map(values, AccountCreateModel, SignUpFormValues);
            const client = new AccountClient();
            client.createAccount(model)
                .then((verification) => {
                    setVerificationToken(verification.verificationToken);
                    setEmail(values.email);
                })
                .catch((error: any) => {
                    if(error instanceof BadRequestError) {
                        helpers.setErrors(processFormError(error.errors));
                    } else if(error instanceof ConflictError && error.error != null) {
                        helpers.setErrors(processFormError([error.error]));
                    }
                })
                .finally(() => helpers.setSubmitting(false))
        },
        [],
    );
    const signUpFormik: FormikProps<ISignUpFormValues> = useFormik<ISignUpFormValues>({
        initialValues: {
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            accept: false,
            submit: null
        },
        validationSchema: Yup.object({
            email: Yup.string().required('/errors/non-empty').email('/errors/invalid-email'),
            username: Yup.string().test(
                'not-empty',
                '/errors/non-empty',
                val => val != null && val.trim().length > 0
            ),
            firstName: Yup.string().test(
                'not-empty',
                '/errors/non-empty',
                val => val != null && val.trim().length > 0
            ),
            lastName: Yup.string().test(
                'not-empty',
                '/errors/non-empty',
                val => val != null && val.trim().length > 0
            ),
            password: Yup.string().required('/errors/non-empty'),
            confirmPassword: Yup.string().test(
                'passwords-same',
                '/errors/passwords-not-match',
                (value, context) => value === context.resolve(Yup.ref('password'))
            ),
            accept: Yup.boolean().isTrue('/errors/accept-terms')
        }),
        onSubmit: handleSignUpSubmit
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
            client.resendVerification({ email })
                .then((verification) => {
                    setVerificationToken(verification.verificationToken);
                    enqueueSnackbar(strings('/verification/resend-success'), { variant: 'success' });
                })
                .catch(() => enqueueSnackbar(strings('/verification/resend-fail'), { variant: 'error' }))
                .finally(() => setVerificationResending(false));
        }, 
        [email, enqueueSnackbar, strings]
    );

    const handleReset = useCallback(() => {
        verificationFormik.resetForm();
        signUpFormik.resetForm();
        setVerified(false);
        setVerificationToken(undefined);
    }, []);

    return Children.only(
        cloneElement(
            children, 
            {
                strings, 
                signUpFormik, 
                verificationFormik,
                verification: verificationToken != null,
                verificationResending,
                onVerificationResend: handleVerificationResend,
                verified,
                onReset: handleReset
            }
        )
    );
}

export default RegistrationViewModel;