import {Typography, Badge, Box} from "@mui/material";
import DocumentButtonStyled from "./overrides/documentButtonStyle";
import {capitalize} from 'lodash'

function DocumentButton({...props}) {
    const {lable, icon, uuid, selected, notifications, handleOnClick, t} = props;
    return (
        <DocumentButtonStyled variant="outlined"
                              style={{border: selected === uuid ? '2px solid #0696D6' : ''}}
                              onClick={() => handleOnClick(uuid)}>
            <Badge badgeContent={notifications} color="warning"/>
            <div style={{width: "fit-content", margin: "auto"}}>
                <Box
                    component={"img"}
                    src={icon}
                    width="30px"
                    height="30px"
                />
            </div>
            <Typography variant="body2">{capitalize(t(lable))}</Typography>
        </DocumentButtonStyled>
    );
}

export default DocumentButton;
