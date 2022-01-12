import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { cloneElement, ReactElement } from "react";
import { v4 } from "uuid";
import styleSheet from "../resources/styles/components/NotesColumn";
import ConditionalView from "./ConditionalView";

export type Props = {
    title: string,
    notes: any[],
    getNoteMediaUrl: (note: any) => string|undefined,
    getNoteTitle: (note: any) => string|undefined,
    getNoteContent: (note: any) => string|undefined,
    renderNoteMedia?: (note: any) => ReactElement
};

const NotesColumn = ({
    title,
    notes,
    getNoteMediaUrl,
    renderNoteMedia,
    getNoteTitle,
    getNoteContent 
}: Props) => {
    const classes = styleSheet();
    return (
        <Box className={classes.root}>
            <Box className={classes.header}>
                <Typography className={classes.title}>
                    {title}
                </Typography>
            </Box>
            {notes.map((note) => {
                const mediaUrl = getNoteMediaUrl(note);
                return (
                    <Card key={v4()} className={classes.note}>
                        <CardMedia>
                            {
                                renderNoteMedia != null && (
                                    cloneElement(renderNoteMedia(note))
                                ) || (
                                    <ConditionalView condition={mediaUrl != null}>
                                        <img
                                            className={classes.noteMedia}
                                            src={getNoteMediaUrl(note)}
                                            alt="media"
                                        />
                                    </ConditionalView>
                                )
                            }
                        </CardMedia>
                        <CardContent>
                            <Typography className={classes.noteTitle}>
                                {getNoteTitle(note)}
                            </Typography>
                            <Typography className={classes.noteContent}>
                                {getNoteContent(note)}
                            </Typography>
                        </CardContent>
                    </Card>
                )
            })}
        </Box>
    );
};

NotesColumn.defaultProps = {
    title: '',
    notes: [],
    getNoteMediaUrl: (note: any) => null,
    getNoteTitle: (note: any) => null,
    getNoteContent: (note: any) => null
};

export default NotesColumn;
