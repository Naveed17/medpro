import { useState, useRef, useEffect } from "react";
import { IconButton, Box, Stack, useMediaQuery } from "@mui/material";
import { Label } from "@features/label";
import Icon from "@themes/urlIcon";
import CollapseCardStyled from "./overrides/collapseCardStyle";
import { useTheme, Theme, PaletteColor } from "@mui/material/styles";
import {LoadingScreen} from "@features/loadingScreen";
export default function ConsultationProgressCard({ ...props }) {
    const { index, data, open, onClickAction, translate } = props
    const { color, icon, id } = data;
    const { t, ready } = translate;
    const theme: Theme = useTheme();
    const [offsetTop, setOffsetTop] = useState(0);
    const ref = useRef<HTMLHeadingElement>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    useEffect(() => {
        if (ref.current) {
            setOffsetTop(ref.current.offsetTop);
        }
        return () => {
            setOffsetTop(0);
        }
    }, []);
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);



    return (
        <>
            <CollapseCardStyled
                elevation={0}
                ref={ref}
                sx={{
                    borderTop: `4px solid ${(theme?.palette[color as keyof typeof theme.palette] as PaletteColor).main}`,
                    height: `calc(100vh - ${offsetTop + 100}px)`,
                    width: open.indexOf(id) > -1 ? '100%' : 42
                }}
            >
                <Box
                    className="collapse-header"
                    borderBottom={1}
                    borderColor="divider"

                    sx={
                        open.indexOf(id) > -1 ? {} : {
                            transform: "rotate(90deg)",
                            width: "140px",
                            mt: "45px",
                            ml: "-50px",
                        }
                    }
                >
                    <Box p={1} sx={{ display: "flex", alignItems: "center" }}>
                        {!isMobile &&
                            <IconButton onClick={() => onClickAction(id)} size="small">
                                <Icon path="ic-flesh-droite" />
                            </IconButton>
                        }
                        <Label
                            className="label"
                            variant="filled"
                            color={color}
                        >
                            <Icon path={icon} />
                            {t('room')} {index + 1}
                        </Label>
                    </Box>
                </Box>
                <Stack spacing={1} padding={2}>
                    {props.children}
                </Stack>
            </CollapseCardStyled>
        </>
    );
}
