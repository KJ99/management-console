import { Typography, Box, Grid, FormLabel, FormHelperText } from "@mui/material";
import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styleSheet from "../resources/styles/components/FileDropzone";
import ConditionalView from "./ConditionalView";
import FilePreview from "./FilePreview";

export type Props = {
    accept: string
    onChange: (evt: any) => void,
    label?: string
    error: boolean,
    helperText?: any,
    strings: (name: string, ...args: any[]) => string,
    maxSize: number,
    multiple: boolean,
    disabled: boolean,
    className?: string,
    value: File|File[]
};

const FileDropzone = ({
    accept,
    onChange,
    label,
    error,
    helperText,
    strings,
    maxSize,
    multiple,
    disabled,
    className,
    value
}: Props) => {
    const classes = styleSheet();
    const handleDrop = useCallback((acceptedFiles) => {
        if(multiple) {
            onChange(acceptedFiles);
        } else if (acceptedFiles.length > 0) {
            onChange(acceptedFiles[0]);
        }
    }, [onChange]);

    const handleRemove = useCallback((file: File) => {
        if (Array.isArray(value)) {
            const all = [...value];
            all.splice(value.indexOf(file), 1);
            onChange(all);
        } else {
            onChange(undefined)
        }
    }, [onChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept,
        maxSize,
        maxFiles: multiple ? 0 : 1,
        disabled
    });

    return (
        <>
            <ConditionalView condition={label != null}>
                <FormLabel>{label}</FormLabel>
            </ConditionalView>
            <section
                {...getRootProps()}
                className={clsx(classes.root, className, {
                    [classes.active]: isDragActive
                })}
            >
                <input {...getInputProps()} />
                <ConditionalView
                    condition={isDragActive}
                    otherwise={
                        <Typography className={classes.label}>{strings('/dropzone/not-active')}</Typography>
                    }
                >
                    <Typography className={classes.label}>{strings('/dropzone/active')}</Typography>
                </ConditionalView>
                <Box className={classes.previewsContainer}>
                    {value instanceof File && 
                        <FilePreview 
                            file={value} 
                            onRemove={() => handleRemove(value)}
                        />
                    }
                    {Array.isArray(value) && (
                        value.map((file) => (
                            <Box mr={2}>
                                <FilePreview
                                    file={file}
                                    onRemove={() => handleRemove(file)}
                                />
                            </Box>
                        ))
                    )}
                </Box>
            </section>
            <ConditionalView condition={helperText != null}>
                <FormHelperText error={error}>{helperText}</FormHelperText>
            </ConditionalView>
        </>
    );
};

FileDropzone.defaultProps = {
    accept: '*/*',
    onChange: (evt: any) => {},
    error: false,
    helperText: null,
    strings: (name: string, ...args: any[]) => '',
    maxSize: 1024 * 1024,
    multiple: false,
    disabled: false,
    className: null,
    value: [],
    label: null
}

export default FileDropzone;