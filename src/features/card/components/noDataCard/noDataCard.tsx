import {Typography, Button} from "@mui/material";
import {RootStyled} from "./overrides";
import Icon from "@themes/urlIcon";

export default function NoDataCard({...props}) {
    const {data, t, ns = "agenda", onHandleClick = null} = props;
    const {
        mainIcon,
        title,
        description,
        buttonText = null,
        buttonIcon,
        buttonVariant
    } = data;

    return (
        <RootStyled>
            <Icon path={mainIcon} className="main-icon"/>
            <Typography
                variant="subtitle1"
                color="text.primary"
                my={3}
                fontWeight={600}
            >
                {t(title, {ns})}
            </Typography>
            <Typography variant="body2" color="#00234B" mb={3}>
                {t(description, {ns})}
            </Typography>
            {buttonText && <Button
                variant="contained"
                {...(onHandleClick && {onClick: onHandleClick})}
                color={buttonVariant}
                startIcon={<Icon path={buttonIcon}/>}
            >
                {t(buttonText, {ns})}
            </Button>}
        </RootStyled>
    );
}
