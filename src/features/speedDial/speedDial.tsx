import * as React from "react";
// material
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
interface SpeedDialProps {
  icon: React.ReactElement;
  name: string;
}
export default function SpeedDialTooltipOpen({ ...props }) {
  const { actions, onClick } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onClickAction = (action: SpeedDialProps) => () => {
    onClick(action);
    setOpen(false);
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial tooltip example"
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      {...props}
    >
      {actions.map((action: SpeedDialProps) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={onClickAction(action)}
        />
      ))}
    </SpeedDial>
  );
}
