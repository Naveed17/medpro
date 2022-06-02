import {DialogData} from "@features/settingsDialogs";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {Button} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import Dialog from "@mui/material/Dialog";

function SettingsDialogs({...props}) {
    const selectted = DialogData.find((item) =>
        item.action === props.action
    );

    const Component: any = selectted?.component;
    return selectted ? (
        <>
            <Dialog
                open={props.open}
                onClose={props.dialogClose}
                scroll='paper'
                dir={props.direction}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description">
                <DialogTitle id="scroll-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}>
                    </DialogContentText>
                    <Component/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.dialogClose} startIcon={<CloseIcon/>}>{props.t('profil.cancel')}</Button>
                    <Button variant="contained"
                            startIcon={<IconUrl path='ic-dowlaodfile'></IconUrl>}>{props.t('profil.save')}</Button>
                </DialogActions>
            </Dialog>
        </>): <></>

}

export default SettingsDialogs;
