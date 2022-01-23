import { DatePicker } from "@mui/lab";
import { Autocomplete, AutocompleteProps, Box, Grid, MenuItem, TextField, TextFieldProps, Typography } from "@mui/material";
import { FormikProps } from "formik";
import moment, { Moment } from "moment";
import Member from "../../models/member/Member";
import ProfilePicture from "../ProfilePicture";

export class ActionItemFormModel {
    title?: string;
    dueDate?: Moment;
    assignee?: Member
}

export type Props = {
    strings: (name: any, ...args: any[]) => string
    formik: FormikProps<ActionItemFormModel>
    members: Member[]
}

const ActionItemForm = ({ strings, formik, members }: Props) => {
    const {
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        touched,
        errors
    } = formik;
    return (
        <form>
            <Grid container spacing={3} direction="column">
                <Grid item>
                    <TextField
                        name="title"
                        variant="outlined"
                        fullWidth
                        label="Title"
                        value={values.title}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && strings(errors.title)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Grid>
                <Grid item>
                    <DatePicker
                        label={"Due date"}
                        value={values.dueDate}
                        onChange={(val: any) => {
                            const value = moment(val).isValid() 
                                ? moment(val) 
                                : null;
                            setFieldTouched('dueDate', true);
                            setFieldValue('dueDate', value, true);
                        }}
                        renderInput={(params: TextFieldProps) => (
                            <TextField
                                {...params}
                                error={Boolean(touched.dueDate && errors.dueDate)}
                                helperText={touched.dueDate && strings(errors.dueDate)}
                            />
                        )}
                    />
                </Grid>
                <Grid item>
                    <Autocomplete
                        value={values.assignee}
                        options={members}
                        getOptionLabel={(member) => `${member.firstName} ${member.lastName}`}
                        renderInput={(props: any) => (
                            <TextField
                                {...props}
                                label="Assignee"
                                error={Boolean(touched.assignee && errors.assignee)}
                                helperText={touched.assignee && strings(errors.assignee)}
                            />
                        )}
                        renderOption={(props: any, option: Member) => (
                            <MenuItem {...props}>
                                <Box mr={1}>  
                                    <ProfilePicture user={option} variant="small" />
                                </Box>
                                <Typography>{option.firstName} {option.lastName}</Typography>
                            </MenuItem>
                        )}
                        onChange={(_: any, val: Member|null) => {
                            setFieldTouched('assignee', true);
                            setFieldValue('assignee', val, true);
                        }}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default ActionItemForm;
