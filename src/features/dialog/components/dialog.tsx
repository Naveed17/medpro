import {DialogData} from "@features/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog, {DialogProps} from "@mui/material/Dialog";
import {DialogActions, DialogContent, DialogContentText} from "@mui/material";
import {Theme} from "@mui/material/styles";
import {useState} from "react";

function Dialogs({...props}) {
    const {action, data, contrastText, open, dialogClose, direction, color, title, actionDialog} = props;

    const selected = DialogData.find((item) => item.action === action);
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('md');
    const Component: any = selected ? selected.component : action;

    return (
        <Dialog
            open={open}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            onClose={dialogClose}
            scroll="paper"
            dir={direction}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description">
            <DialogTitle sx={{
                backgroundColor: color ? color : (theme: Theme) => theme.palette.primary.main,
                color: `${contrastText} !important` as any
            }}
                         id="scroll-dialog-title">{title}</DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText
                    id="scroll-dialog-description"
                    tabIndex={-1}/>
                <Component data={data}/>
            </DialogContent>
            <DialogActions>{actionDialog}</DialogActions>
        </Dialog>
    );
}

export default Dialogs;
