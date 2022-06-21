import React from "react";
import { Paper, IconButton, Box, Stack } from "@mui/material";
import { Label } from "@features/label";
import Icon from "@themes/urlIcon";
import CollapseCardStyled from "./overrides/collapseCardStyle";
import { useTheme } from "@mui/material/styles";
export default function ConsultationProgressCard({ ...props }) {
    const { index, data, open, onClickAction } = props
    const { color, icon, id, } = data;
    const theme = useTheme<any>()
    const [offsetTop, setOffsetTop] = React.useState<number>(0);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current) {
            setOffsetTop(ref.current.offsetTop);
        }
    }, []);
    return (
        <CollapseCardStyled
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
                    <IconButton onClick={() => onClickAction(id)} size="small">
                        <Icon path="ic-flesh-droite" />
                    </IconButton>
                    <Label
                        className="label"
                        variant="filled"
                        color={color}
                        sx={{


                        }}
                    >
                        <Icon path={icon} />
                        Salle {index + 1}
                    </Label>
                </Box>
            </Box>
            <Stack spacing={1} padding={2}>
                {props.children}
            </Stack>
        </CollapseCardStyled>
    );
}
