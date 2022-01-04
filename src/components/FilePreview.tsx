import { Close } from "@mui/icons-material";
import { Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import numeral from "numeral";
import styleSheet from "../resources/styles/components/FileDropzone";
import ConditionalView from "./ConditionalView";

export type Props = {
    file: File,
    onRemove: () => void
}

const FilePreview = ({ file, onRemove }: Props) => {
    const classes = styleSheet();
    return (
        <Card className={classes.preview}>
            <CardActions onClick={(evt) => {
                evt.stopPropagation();
                onRemove();
            }}>
                <IconButton>
                    <Close />
                </IconButton>
            </CardActions>
            <CardMedia>
                <ConditionalView
                    condition={new RegExp('image/.*').test(file.type)}
                >
                    <img
                        className={classes.previewPicture}
                        src={URL.createObjectURL(file)}
                    />
                </ConditionalView>
            </CardMedia>
            <CardContent>
                <Typography className={classes.previewFileName}>
                    {file.name}
                </Typography>
                <Typography className={classes.previewFileSize}>
                    {numeral(file.size).format('0.00 b')}
                </Typography>
            </CardContent>
        </Card>
    );
};

FilePreview.defaultProps = {
    onRemove: () => {}
}

export default FilePreview;