import { useState, useRef, useEffect } from "react";
import { Box, Stack, Fade } from "@mui/material";
import { Label } from "@features/label";
import Icon from "@themes/urlIcon";
import MobileCollapseCardStyled from "./overrides/mobileCollapseCardStyle";
import { useTheme, Theme } from "@mui/material/styles";
export default function ConsultationProgressCard({ ...props }) {
    const { index, data, open, translate, mobileCollapse } = props
    const { color, icon, id }: { color: string, icon: string, id: number } = data;
    const { t, ready } = translate;
    const theme: Theme = useTheme();
    const [offsetTop, setOffsetTop] = useState<number>(0);
    const ref = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        if (ref.current) {
            setOffsetTop(ref.current.offsetTop);
        }
        return () => {
            setOffsetTop(0);
        }
    }, []);
    if (!ready) return (<>loading translations...</>);


    return (
        <Fade in={mobileCollapse === id}>
            <MobileCollapseCardStyled
                elevation={0}
                ref={ref}
                sx={{
                    borderTop: `4px solid ${theme.palette[color].main}`,
                    height: `calc(100vh - ${offsetTop + 20}px)`,
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
            </MobileCollapseCardStyled>
        </Fade>
    )
}