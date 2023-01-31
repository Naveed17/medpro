import * as React from "react";
// material
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

interface SpeedDialProps {
    icon: React.ReactElement;
    name: string;
}

export default function SpeedDialTooltipOpen({...props}) {
    const {actions, sx, open, onClose, onOpen, handleItemClick} = props;

    const onClickAction = (action: SpeedDialProps) => () => {
        handleItemClick(action);
    };

    return (
        <SpeedDial
            {...{sx, open, onClose, onOpen}}
            ariaLabel="SpeedDial tooltip example"
            icon={<SpeedDialIcon/>}
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
