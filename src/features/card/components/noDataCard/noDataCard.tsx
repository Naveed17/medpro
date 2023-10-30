import {Typography, Button, useMediaQuery, Theme} from "@mui/material";
import {RootStyled} from "./overrides";
import Icon from "@themes/urlIcon";

export default function NoDataCard({...props}) {
    const {data, t, ns = "agenda", onHandleClick = null, ...rest} = props;
    const {
        mainIcon,
        title,
        description,
        buttons = []
    } = data;

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    return (
        <RootStyled {...rest} className={"no-data-card"}>
            {typeof mainIcon === "string" ? <Icon path={mainIcon} className="main-icon"/> : mainIcon}
            <Typography
                variant="subtitle1"
                color="text.primary"
                my={isMobile ? 1 : 3}
                {...(isMobile && {fontSize: 16})}
                fontWeight={600}>
                {t(title, {ns})}
            </Typography>
            <Typography variant="body2" color="#00234B" mb={3}>
                {t(description, {ns})}
            </Typography>
            {buttons.map((button: any, index: number) => (
                <Button
                    key={index}
                    variant="contained"
                    {...(onHandleClick && {onClick: onHandleClick})}
                    color={button.variant}
                    {...(button.icon && {
                        startIcon: (typeof button.icon === "string" ?
                            <Icon color={button.color} path={button.icon}/> : button.icon)
                    })}>
                    {t(button.text, {ns})}
                </Button>
            ))}
        </RootStyled>
    );
}
