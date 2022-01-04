import { Grid, TextField } from '@mui/material';
import { FormikProps } from 'formik';
import Unit from '../../extension/Unit';
import TeamModel from '../../models/team/TeamModel';
import FileDropzone from '../FileDropzone';
import ThemeSelect from '../ThemeSelect';

export class WorkspaceFormModel {
    name?: string;
    theme?: string;
    picture?: File;
}

export type Props = {
    formik: FormikProps<WorkspaceFormModel>,
    strings: (name?: string, ...args: any[]) => string
}

const WorkspaceFrom = ({ formik, strings }: Props) => {
    const {
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        setFieldValue
    } = formik;
    return (
        <form>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <TextField
                        name="name"
                        variant="outlined"
                        fullWidth
                        label={strings("/base/name")}
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && strings(errors.name)}
                    />
                </Grid>
                <Grid item>
                    <ThemeSelect
                        strings={strings}
                        value={values.theme}
                        error={Boolean(touched.theme && errors.theme)}
                        helperText={touched.theme && strings(errors.theme)}
                        onChange={
                            (theme) => {
                                setFieldValue('theme', theme, true)
                            }
                        }
                    />
                </Grid>
                <Grid item>
                    <FileDropzone
                        accept="image/*"
                        strings={strings}
                        value={values.picture}
                        onChange={(file?: File) => setFieldValue('picture', file, true)}
                        maxSize={5 * Unit.MEGABYTE}
                        label={strings('/workspaces/provide-image')}
                        error={Boolean(touched.picture && errors.picture)}
                        helperText={touched.picture && errors.picture}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default WorkspaceFrom;