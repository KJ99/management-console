import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { FormikProps } from "formik";
import { v4 } from "uuid";
import WorkspaceRole from "../../extension/WorkspaceRole";

export class MemberRolesFormModel {
    roles?: string[]
}

export type Props = {
    formik: FormikProps<MemberRolesFormModel>,
    strings: (name: string, ...args: any[]) => string
}

const possibilites = [
    {
        label: '/workspaces/roles-variants/admin',
        value: WorkspaceRole[WorkspaceRole.ADMIN]
    },
    {
        label: '/workspaces/roles-variants/product-owner',
        value: WorkspaceRole[WorkspaceRole.PRODUCT_OWNER]
    },
    {
        label: '/workspaces/roles-variants/scrum-master',
        value: WorkspaceRole[WorkspaceRole.SCRUM_MASTER]
    },
    {
        label: '/workspaces/roles-variants/team-member',
        value: WorkspaceRole[WorkspaceRole.TEAM_MEMBER]
    }
]

const MemberRolesForm = ({strings, formik}: Props) => {
    const {
        values,
        setFieldValue
    } = formik;
    return (
        <form>
            {possibilites.map((variant) => (
                <Box key={v4()}>
                    <FormControlLabel
                        label={strings(variant.label)}
                        control={
                            <Checkbox
                                checked={values.roles?.includes(variant.value)}
                                onChange={(_, checked) => {
                                    let current = [...(values?.roles ?? [])];
                                    if (checked) {
                                        current.push(variant.value);
                                    } else if (current.includes(variant.value)) {
                                        current.splice(current.indexOf(variant.value), 1);
                                    }
                                    setFieldValue('roles', current);
                                }}
                            />
                        }
                    />
                </Box>
            ))}
        </form>
    );
}

export default MemberRolesForm;