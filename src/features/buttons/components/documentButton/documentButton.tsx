import {Typography, Badge} from "@mui/material";
import DocumentButtonStyled from "./overrides/documentButtonStyle";
import Icon from '@themes/urlIcon';

function DocumentButton({...props}) {
    const {lable, icon, notifications, handleOnClick} = props;
    return (
        <DocumentButtonStyled variant="outlined" onClick={() => handleOnClick(lable)}>
            <Badge badgeContent={notifications} color="warning"/>
            <Icon path={icon}/>
            <Typography>{lable}</Typography>
        </DocumentButtonStyled>
    );
}

export default DocumentButton;
