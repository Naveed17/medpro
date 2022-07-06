import { DialogData } from "@features/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

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
        <DialogTitle id="scroll-dialog-title">{props.title}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          ></DialogContentText>
          <Component {...props} />
        </DialogContent>
        <DialogActions>{props.actionDialog}</DialogActions>
      </Dialog>
    </>
  );
}

export default SettingsDialogs;
