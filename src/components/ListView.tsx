import { ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Pagination, Typography } from "@mui/material";
import { cloneElement, ReactElement, useCallback, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { v4 } from "uuid";
import styleSheet from "../resources/styles/components/ListView";
import ConditionalView from "./ConditionalView";

export type Props = {
    title?: string,
    data: any[],
    page: number,
    totalPages: number,
    onPageChange?: (page: number) => void,
    getRowTitle: (value: any) => string,
    getRowSubtitle?: (value: any) => string,
    getActionHref?: (item: any) => string,
    onSelect: (item: any) => void,
    actionIcon?: ReactElement,
    hideAction: boolean
};

const ListView = ({
    title,
    data,
    page,
    totalPages,
    onPageChange,
    getRowTitle,
    getRowSubtitle,
    getActionHref,
    onSelect,
    actionIcon,
    hideAction
}: Props) => {
    const classes = styleSheet();
    const getActionProps = useCallback((item) => {
        return getActionHref != null
            ? {
                component: NavLink,
                to: getActionHref(item)
            }
            : {
                onClick: onSelect
            }
    }, [getActionHref, onSelect]);

    return (
        <Box>
            <Typography className={classes.title}>
                {title}
            </Typography>
            {data.map((item) => (
                <Box key={v4()} className={classes.row}>
                    <Box>
                        <Typography className={classes.rowTitle}>{getRowTitle(item)}</Typography>
                        {getRowSubtitle != null && (
                            <Typography className={classes.rowSubtitle}>
                                {getRowSubtitle(item)}
                            </Typography>
                        )}
                    </Box>
                    <ConditionalView condition={!hideAction}>
                        <IconButton {...getActionProps(item)}>
                            {actionIcon != null && cloneElement(actionIcon) || (
                                <ChevronRight />
                            )}
                        </IconButton>
                    </ConditionalView>
                </Box>
            ))}
            {onPageChange != null && (
                <Box className={classes.paginationContainer}>
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={(_, page) => onPageChange(page - 1)}
                    />
                </Box>
            )}
        </Box>
    );
};

ListView.defaultProps = {
    data: [],
    page: 0,
    totalPages: 0,
    getRowTitle: (_: any) => '',
    onSelect: (item: any) => {},
    hideAction: false
};

export default ListView;