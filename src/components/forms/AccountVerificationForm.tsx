import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { FormikProps } from 'formik';
import styleSheet from '../../resources/styles/components/forms';
import LoadingButton from '@mui/lab/LoadingButton';
import { ChevronLeft } from '@mui/icons-material';

export interface IVerificationFormValues {
    pin: string
}

export class VerificationFormValues implements IVerificationFormValues {
    pin: string = ''

}

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    formProps: FormikProps<IVerificationFormValues>,
    onResend: () => void,
    resending?: boolean,
    onReset: () => void
};

export const AccountVerificationForm = ({ strings, formProps, resending, onResend, onReset }: Props) => {
    const classes = styleSheet();
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        isSubmitting
    } = formProps;
    return (
        <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <Typography>{strings('/verification/head')}</Typography>
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        fullWidth
                        name="pin"
                        label={strings('/verification/pin')}
                        value={values.pin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.pin && errors.pin)}
                        helperText={touched.pin && strings(errors.pin)}
                    />
                </Grid>
                <Grid item className={classes.submitRow}>
                    <LoadingButton
                        loading={isSubmitting}
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {strings('/verification/submit')}
                    </LoadingButton>
                </Grid>
                <Grid item>
                    <Typography>{strings('/verification/not-received')}</Typography>
                </Grid>
                <Grid item>
                    <Box display="flex" justifyContent="center">
                        <LoadingButton
                            loading={resending}
                            variant="contained"
                            color="primary"
                            onClick={onResend}
                        >
                            {strings('/verification/resend')}
                        </LoadingButton>
                    </Box>
                </Grid>
                <Grid item>
                    <Button
                        variant="text"
                        color="info"
                        startIcon={<ChevronLeft />}
                        onClick={onReset}
                    >
                        {strings('/base/back')}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}