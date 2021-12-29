import { CheckCircleOutline, ChevronLeft } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardHeader, Grid, Link, Typography } from '@mui/material';
import { FormikProps } from 'formik';
import ConditionalView from '../../components/ConditionalView';
import { AccountVerificationForm, IVerificationFormValues } from '../../components/forms/AccountVerificationForm';
import LoginForm, { LoginFormModel } from '../../components/forms/LoginForm';
import Page from '../../components/Page';

export type Props = {
    strings: (name: string, ...args: any[]) => string,
    loginFormik: FormikProps<LoginFormModel>,
    verificationFormik: FormikProps<IVerificationFormValues>,
    needsVerification?: boolean,
    verificationResending?: boolean,
    onVerificationResend: () => void,
    verified: boolean,
    onReset: () => void
}

const LoginPage = ({
    strings,
    needsVerification,
    loginFormik,
    verificationFormik,
    verificationResending,
    onVerificationResend,
    verified,
    onReset
}: Props) => {
    return (
        <Page title={strings('/login/title')}>
            <Grid container justifyContent="center">
                <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                    <Card>
                        <CardHeader title={
                            !needsVerification 
                                ? strings("/login/title")
                                : strings('/verification/title')
                            }
                        />
                        <CardContent>
                            <ConditionalView 
                                condition={!needsVerification}
                                otherwise={
                                    <ConditionalView
                                        condition={!verified}
                                        otherwise={ 
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
                                        }
                                    >
                                        <AccountVerificationForm
                                            strings={strings} 
                                            formProps={verificationFormik}
                                            onResend={onVerificationResend}
                                            resending={verificationResending}
                                            onReset={onReset}
                                        />
                                    </ConditionalView>
                                }
                            >
                                <LoginForm
                                    strings={strings}
                                    formik={loginFormik}
                                />
                            </ConditionalView>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Page>
    );
}

LoginPage.defaultProps = {
    strings: (name: string, ...args: string[]) => '',
    loginFormik: {},
    verificationFormik: {},
    onVerificationResend: () => {},
    onReset: () => {},
    needsVerification: false,
    verificationResending: false,
    verified: false,
}

export default LoginPage;