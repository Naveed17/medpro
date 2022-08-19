import { DialogData } from "@features/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, DialogContentText, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Theme } from "@mui/material/styles";

function SettingsDialogs({ ...props }) {
    const selectted = DialogData.find((item) => item.action === props.action);

    const data = props.data;
    const { action, onClose, actions } = props;
    const Component: any = selectted ? selectted.component : action;

    return (
        <>
            <Dialog
                open={props.open}
                onClose={props.dialogClose}
                scroll="paper"
                {...(props.max ? { maxWidth: 'lg' } : { maxWidth: 'sm' })}
                dir={props.direction}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description">
                <DialogTitle sx={{
                    backgroundColor: props.color ? props.color : (theme: Theme) => theme.palette.primary.main,
                    position: 'relative',
                }}
                    id="scroll-dialog-title">{props.title}
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: (theme) => theme.palette.grey[0],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1} />
                    <Component data={data} />
                </DialogContent>
                {actions ? (
                    <DialogActions>{props.actionDialog}</DialogActions>
                ) : null}
            </Dialog>
        </>
    );
}

export default SettingsDialogs;
