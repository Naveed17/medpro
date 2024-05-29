import {
    Typography,
    Badge,
    Skeleton,
    useTheme,
    Theme,
} from "@mui/material";
import DocumentButtonStyled from "./overrides/documentButtonStyle";
import {capitalize} from "lodash";
import {ImageHandler} from "@features/image";
import React, {useCallback} from "react";

function DocumentButton({...props}) {
    const theme = useTheme() as Theme;
    const {
        lable,
        type,
        icon,
        uuid,
        selected,
        notifications,
        onClick,
        acceptedFormat,
        onChange,
        loading = false,
        height,
        paddingTop,
        t,
        active,
    } = props;

    const handleOnClick = useCallback((uuid: string, event: React.MouseEvent<HTMLButtonElement>) => {
        onClick(uuid, event);
    }, [onClick]);

    const handleChange = useCallback((event: React.SyntheticEvent) => {
        onChange(event);
    }, [onChange]);

    return (
        <DocumentButtonStyled
            variant="outlined"
            style={{
                border: selected === uuid ? "2px solid #0696D6" : "",
                height: height,
                paddingTop: paddingTop,
            }}
            {...(lable === active && {
                sx: {
                    border: `2px solid ${theme.palette.primary.main}`,
                },
            })}
            onClick={(e) => {
                e.stopPropagation();
                handleOnClick(uuid, e)
            }}>
            <Badge badgeContent={notifications} color="warning"/>
            {loading ? (
                <>
                    <Skeleton
                        variant={"rectangular"}
                        width={40}
                        height={40}
                        style={{borderRadius: 10}}></Skeleton>
                    <Skeleton variant={"text"} width={80}></Skeleton>
                </>
            ) : (
                <>
                    <div style={{width: "fit-content", margin: "auto"}}>
                        <ImageHandler src={icon} width="30" height="30"/>
                        {type !== "audio" &&
                            <input type="file"
                                   accept={acceptedFormat}
                                   multiple={true}
                                   onChange={handleChange}
                                   style={{
                                       width: '100%',
                                       height: '100%',
                                       position: 'absolute',
                                       left: 0,
                                       top: 0,
                                       opacity: 0
                                   }}/>}
                    </div>

                    <Typography variant="body2">{capitalize(t(lable))}</Typography>
                </>
            )}
        </DocumentButtonStyled>
    );
}

export default DocumentButton;
