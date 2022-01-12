import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { FormikHelpers, useFormik } from "formik";
import DailyConfig from "../../models/daily/DailyConfig";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import ConfigurationsClient from "../../infrastructure/clients/daily-helper/ConfigurationsClient";
import { useParams } from "react-router";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import { DailyConfigFormModel } from "../../components/forms/DailyConfigurationForm";
import DailyConfigModel from "../../models/daily/DailyConfigModel";
import BadRequestError from "../../infrastructure/api/exceptions/BadRequestError";
import { processFormError } from "../../utils/ErrorProcessor";
import { mapper } from "../../utils/Mapper";
import NotFoundError from "../../infrastructure/api/exceptions/NotFoundError";
import moment from "moment";

const client = new ConfigurationsClient();

const ConfigureDailyViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [loaded, setLoaded] = useState(false);
    const [config, setConfig] = useState<DailyConfig|undefined>();
    const { workspaceId } = useParams();
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const teamId = parseInt(workspaceId ?? '-1');
        if (teamId >= 0) {
            client.get(teamId)
                .then((config) => setConfig(config))
                .catch((e) => {
                   if (e instanceof NotFoundError) {
                       setConfig(undefined); 
                   } else {
                        enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }) 
                   }
                })
                .finally(() => setLoaded(true));
        }
    }, [workspaceId]);

    const handleUpdate = useCallback(
        (values: DailyConfigFormModel, helpers: FormikHelpers<DailyConfigFormModel>) => {
            if (workspaceId == null) {
                return;
            }
            const model = new DailyConfigModel();
            model.teamId = parseInt(workspaceId ?? '-1');
            
            model.hourlyDeadline = values.hourlyDeadline != null
                ? moment(values.hourlyDeadline).format("HH:mm")
                : undefined;
            console.log(model)
            client.createConfiguration(model)
                .then(
                    (config) => {
                        setConfig(
                            (prev) => ({
                                ...prev,
                                hourlyDeadline: config.hourlyDeadline
                            })
                        )
                        enqueueSnackbar(
                            strings('/daily/configure-success'),
                            { variant: 'success' }
                        );
                    }
                )
                .catch(e => {
                    if (e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/daily/configure-fail'), { variant: 'error' });
                    }
                })
                .finally(() => helpers.setSubmitting(false))
        },
        [enqueueSnackbar, strings, workspaceId]
    );

    const formik = useFormik<DailyConfigFormModel>({
        initialValues: {
            hourlyDeadline: undefined
        },
        onSubmit: handleUpdate
    });

    useEffect(() => {
        const deadline = config?.hourlyDeadline != null
            ? moment(config?.hourlyDeadline, 'HH:mm')
            : undefined;
        formik.setValues({ hourlyDeadline: deadline });
    }, [formik.setValues, config]);

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                loaded,
                workspace,
                formik
            }
        )
    );
}

export default ConfigureDailyViewModel;