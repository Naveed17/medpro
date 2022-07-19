import { DialogData } from "@features/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, DialogContentText } from "@mui/material";

function SettingsDialogs({ ...props }) {
  const selectted = DialogData.find((item) => item.action === props.action);

  const { action } = props;
  const Component: any = selectted ? selectted.component : action;

  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.dialogClose}
        scroll="paper"
        dir={props.direction}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          sx={{ backgroundColor: props.color ? props.color : "#0096d6" }}
          id="scroll-dialog-title"
        >
          {props.title}
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1} />
          <Component {...props} />
        </DialogContent>
        <DialogActions>{props.actionDialog}</DialogActions>
      </Dialog>
    </>
  );
}

export default SettingsDialogs;
