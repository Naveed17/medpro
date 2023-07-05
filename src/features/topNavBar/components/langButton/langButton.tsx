import {useState} from "react";
import Langs from "@features/topNavBar/components/langButton/config";
import {MenuStyled, RootStyled} from "@features/topNavBar";
import {Button, Fade, ListItemText, MenuItem} from "@mui/material";
import {Box} from "@mui/system";
import CodeIcon from "@mui/icons-material/Code";
import GlobeIcon from "@themes/overrides/icons/globeIcon";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import {useRouter} from "next/router";

function LangButton() {
    const router = useRouter();
    const { locale } = useAppSelector(configSelector);
    const [anchorEl, setAnchorEl] = useState(null);
    const lang = Langs[locale];
    const [selected, setselected] = useState(lang);

    const handleClick = (event: any) => {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    }

    const handleClose= ({...props}) => {
        setAnchorEl(null);
        if (props.locale !== undefined  && selected.locale !== props.locale) {
            setselected(props);
            router.replace(router.pathname, router.asPath, {locale: props.locale});
        }
    }

    return (
        <RootStyled>
            <Button
                startIcon={<GlobeIcon />}
                endIcon={
                    <CodeIcon
                        sx={{
                            transform: "rotate(90deg)",
                        }}
                    />
                }
                variant="outlined"
                aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={handleClick}>
                {selected.label}

            </Button>
            <MenuStyled
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleClose(selected[1])}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        ml: -1,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                TransitionComponent={Fade}
            >
                {Object.entries(Langs).map((item,key) => (
                    <MenuItem onClick={() => handleClose(item[1])} key={item[1].locale} disableRipple>
                        <Box mr={1} width={20} component="img" src={item[1].icon} />
                        <ListItemText sx={{ fontSize: 12 }}>{item[1].label}</ListItemText>
                    </MenuItem>
                ))}
            </MenuStyled>
        </RootStyled >
    );
}
export default LangButton;
