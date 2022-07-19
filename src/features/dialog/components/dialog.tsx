import {DialogData} from "@features/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {DialogActions, DialogContent, DialogContentText} from "@mui/material";
import {Theme} from "@mui/material/styles";

function SettingsDialogs({...props}) {
    const selectted = DialogData.find((item) => item.action === props.action);

    const data = props.data;
    const {action} = props;
    const Component: any = selectted ? selectted.component : action;

    return (
        <>
            <Dialog
                open={props.open}
                onClose={props.dialogClose}
                scroll="paper"
                maxWidth={"sm"}
                dir={props.direction}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description">
                <DialogTitle sx={{
                    backgroundColor: props.color ? props.color : (theme: Theme) => theme.palette.primary.main }}
                             id="scroll-dialog-title">{props.title}</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}/>
                    <Component data={data}/>
                </DialogContent>
                <DialogActions>{props.actionDialog}</DialogActions>
            </Dialog>
        </>
    );
}

export default SettingsDialogs;
