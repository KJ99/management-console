import { Box, Button, Card, CardContent, CardHeader, FormControlLabel, Grid, Link, Switch, TextField, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { FC } from "react";
import Page from "../../components/Page";
import styleSheet from '../../resources/styles/pages/auth/RegistrationPage';
import Captcha from 'react-google-recaptcha';
import { FormikProps } from 'formik';
import SignUpForm, { ISignUpFormValues } from "../../components/forms/SignUpForm";
import { AccountVerificationForm, IVerificationFormValues } from "../../components/forms/AccountVerificationForm";
import { CheckCircleOutline, ChevronLeft } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import paths from '../../routings/paths.json';

export type Props = {
    strings: (name: string, ...args: string[]) => string,
    signUpFormik: FormikProps<ISignUpFormValues>,
    verificationFormik: FormikProps<IVerificationFormValues>,
    verification?: boolean,
    verificationResending?: boolean,
    onVerificationResend: () => void,
    verified?: boolean,
    onReset: () => void
}

const RegistrationPage = (
    {
        strings, 
        signUpFormik, 
        verification, 
        verificationFormik ,
        onVerificationResend,
        verificationResending,
        verified,
        onReset
    }: Props
) => {
    return (
        <Page title={strings('/registration/title')}>
            <Grid container justifyContent="center">
                <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                    <Card>
                        <CardHeader title={
                            !verification 
                                ? strings("/registration/title")
                                : strings('/verification/title')
                        }/>
                        <CardContent>
                            {
                                !verification && (
                                    <SignUpForm strings={strings} formProps={signUpFormik} />
                                ) || (
                                    !verified && (
                                        <AccountVerificationForm
                                            strings={strings} 
                                            formProps={verificationFormik}
                                            onResend={onVerificationResend}
                                            resending={verificationResending}
                                            onReset={onReset}
                                        />
                                    ) || (
                                        <Box>
                                            <Box display="flex" justifyContent="center">
                                                <CheckCircleOutline
                                                    fontSize="large"
                                                    color="primary"
                                                />
                                            </Box>
                                            <Box mt={3} display="flex" justifyContent="center">
                                                <Typography>{strings('/verification/success')}</Typography>
                                            </Box>
                                            <Box mt={3} display="flex" justifyContent="center">
                                                <Link component={RouterLink} color="info" to={paths.auth.login} underline="hover">
                                                    {strings('/base/login')}
                                                </Link>
                                            </Box>
                                            <Box mt={3}>
                                                <Button
                                                    variant="text"
                                                    color="info"
                                                    startIcon={<ChevronLeft />}
                                                    onClick={onReset}
                                                >
                                                    {strings('/base/back')}
                                                </Button>
                                            </Box>
                                        </Box>
                                    )
                                )
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Page>
    );
}

RegistrationPage.defaultProps = {
    strings: (name: string, ...args: string[]) => '',
    signUpFormik: {},
    verificationFormik: {},
    onVerificationResend: () => {},
    onReset: () => {}
}

export default RegistrationPage;