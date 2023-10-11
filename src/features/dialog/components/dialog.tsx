import {DialogData} from "@features/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {DialogActions, DialogContent, DialogContentText, IconButton, Stack, useMediaQuery} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Theme} from "@mui/material/styles";
import Dialog, {DialogProps} from "@mui/material/Dialog";
import React, {useEffect, useState} from "react";
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

function Dialogs({...props}) {
    const {
        action,
        data,
        contrastText,
        open,
        dialogClose,
        direction,
        color,
        title,
        actionDialog,
        headerDialog = null,
        onClose,
        icon,
        size = "md",
        enableFullScreen = false,
        sx,
        ...rest
    } = props;
    const selected = DialogData.find((item) => item.action === action);
    const [fullWidth] = useState(true);
    const [fullScreen, setFullScreen] = useState(false);
    const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>(size);
    const Component: any = selected ? selected.component : action;
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    useEffect(() => {
        size && setMaxWidth(size);
    }, [size]);

    return (
        <>
            <Dialog
                {...(fullScreen && {fullScreen: true})}
                {...{open, maxWidth, fullWidth}}
                {...rest}
                onClose={dialogClose}
                scroll="paper"
                dir={direction}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                {...(smScreen && {
                    PaperProps: {
                        sx: {
                            width: '100%',
                            m: 1,
                        }

                    }
                })}>
                {!headerDialog ? <DialogTitle
                    sx={{
                        backgroundColor: color
                            ? color
                            : (theme: Theme) => theme.palette.primary.main,
                        color: `${contrastText} !important` as any,
                        position: "relative",
                    }}
                    id="scroll-dialog-title">
                    <Stack direction={"row"}>
                        {icon && <HourglassEmptyRoundedIcon/>}
                        {title}
                    </Stack>
                    {enableFullScreen && <IconButton
                        aria-label="close"
                        onClick={() => setFullScreen(!fullScreen)}
                        sx={{
                            position: "absolute",
                            right: onClose ? "3rem" : 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: (theme) => theme.palette.grey[0],
                        }}>
                        <FullscreenIcon/>
                    </IconButton>}
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: (theme) => theme.palette.grey[0],
                            }}>
                            <CloseIcon/>
                        </IconButton>
                    ) : null}
                </DialogTitle> : headerDialog}
                <DialogContent
                    dividers={true}
                    sx={{...sx}}
                    {...(fullScreen && {sx: {minHeight: 600}})}
                    style={{overflow: action === 'write_certif' ? 'hidden' : ''}}>
                    <DialogContentText id="scroll-dialog-description" tabIndex={-1}/>
                    <Component {...(data && {data, fullScreen})}/>
                </DialogContent>
                {actionDialog ? <DialogActions style={{width: '100%'}}>{actionDialog}</DialogActions> : null}
            </Dialog>
        </>
    );
}

export default Dialogs;
