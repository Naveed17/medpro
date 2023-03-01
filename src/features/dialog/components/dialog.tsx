import {DialogData} from "@features/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {DialogActions, DialogContent, DialogContentText, IconButton, Stack,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Theme} from "@mui/material/styles";
import Dialog, {DialogProps} from "@mui/material/Dialog";
import React, {useState} from "react";
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
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
        onClose,
        icon,
        size = "md",
        sx,
        ...rest
    } = props;
    const selected = DialogData.find((item) => item.action === action);
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>(size);
    const Component: any = selected ? selected.component : action;

    return (
        <>
            <Dialog
                {...rest}
                {...{open, maxWidth, fullWidth}}
                onClose={dialogClose}
                scroll="paper"
                dir={direction}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle
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
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent dividers={true} sx={{...sx}}
                               style={{overflow: action === 'write_certif' ? 'hidden' : ''}}>
                    <DialogContentText id="scroll-dialog-description" tabIndex={-1}/>
                    <Component data={data}/>
                </DialogContent>
                {actionDialog ? <DialogActions style={{width: '100%'}}>{actionDialog}</DialogActions> : null}
            </Dialog>
        </>
    );
}

export default Dialogs;
