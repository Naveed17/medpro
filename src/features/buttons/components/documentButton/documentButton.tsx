import { Typography, Badge } from "@mui/material";
import DocumentButtonStyled from "./overrides/documentButtonStyle";
import Icon from '@themes/urlIcon';
import { capitalize } from 'lodash'
function DocumentButton({ ...props }) {
    const { lable, icon, notifications, handleOnClick, t } = props;
    return (
        <DocumentButtonStyled variant="outlined" onClick={() => handleOnClick(lable)}>
            <Badge badgeContent={notifications} color="warning" />
            <Icon path={icon} />
            <Typography variant="body2">{capitalize(t(lable))}</Typography>
        </DocumentButtonStyled>
    );
}

export default DocumentButton;
