import { ArrowDownward, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Box, Button, Collapse, IconButton, ListItem, SvgIconTypeMap, Typography, useThemeProps } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { useTheme } from "@mui/styles";
import clsx from "clsx";
import { cloneElement, Component, createElement, Fragment, ReactElement, useContext, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { v4 } from "uuid";
import ConditionalView from "../ConditionalView";
import styleSheet from "../../resources/styles/components/nav/NavDrawer";

export interface INavElement {
    label: string,
    icon?: OverridableComponent<SvgIconTypeMap>,
    pattern: string,
    href?: string,
    children: INavElement[],
    depth: number,
    onClick?: (evt: any) => void
}

enum ElementType {
    SECTION,
    LINK,
    BUTTON
}

const getElementType = (children: INavElement[], onClick?: (evt: any) => void) => {
    let elementType = ElementType.SECTION;
    if (children.length == 0) {
        elementType = ElementType.LINK;
    } else if (onClick != null) {
        elementType = ElementType.BUTTON;
    }

    return elementType;
}

const getAdditionalProps = (elementType: ElementType, href?: string, onClick?: (evt: any) => void) => {
    let props;
    switch(elementType) {
        case ElementType.LINK:
            props = {
                component: NavLink,
                to: href
            };
            break;
        case ElementType.BUTTON:
            props = {
                component: Button,
                onClick: onClick
            };
            break;
        default:
            props = {};
            break;
    }

    return props;
}

const NavElement = ({
    label,
    icon,
    pattern,
    href,
    children,
    depth,
    onClick,
}: INavElement) => {
    const classes = styleSheet({ depth });
    const location = useLocation();
    const regex = useMemo(() => new RegExp(pattern), [pattern]);
    const active = useMemo(() => regex.test(location.pathname), [regex, location]);
    const elementType = useMemo(() => getElementType(children, onClick), [children, onClick]);
    const [expanded, setExpanded] = useState<boolean>(active);
    const addtionalProps = useMemo(() => getAdditionalProps(elementType, href, onClick), [elementType, href, onClick]);
    return (
        <Fragment>
            <ListItem
                className={clsx(classes.item, {
                    [classes.linkActive]: elementType == ElementType.LINK && active,
                    [classes.linkItem]: elementType == ElementType.LINK
                })}
                {...addtionalProps}
            >
                {icon && createElement(icon!)}
                <Typography className={classes.itemTitle}>{label}</Typography>
                <ConditionalView condition={elementType == ElementType.SECTION}>
                    <>
                        <Box className={classes.divider}></Box>
                        <IconButton onClick={() => setExpanded(!expanded)}>
                            <ConditionalView
                                condition={expanded} 
                                otherwise={<KeyboardArrowDown />}
                            >
                                <KeyboardArrowUp />    
                            </ConditionalView>
                        </IconButton>
                    </>
                </ConditionalView>
            </ListItem>
            <Collapse in={elementType == ElementType.SECTION && expanded}>
                {children.map((child) => (
                    <NavElement
                        key={v4()}
                        {...child}
                    />
                ))}
            </Collapse>
        </Fragment>
    )
}

NavElement.defaultProps = {
    depth: 0,
    children: [],
    pattern: '^$'
}

export default NavElement;