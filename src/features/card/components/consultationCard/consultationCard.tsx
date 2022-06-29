import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, IconButton, Divider, } from "@mui/material";

import { Label } from '@features/label'

import Icon from "@themes/urlIcon";
import { useTheme, PaletteColor } from '@mui/material/styles';

function ConsultationCard({ item, index, t, isMobile, children, collapse }: { collapse: Function; item: any; index: number; t: Function; isMobile: boolean, children: React.ReactNode }) {
    const [offsetTop, setOffsetTop] = useState(0);
    const [open, setopen] = useState(false);
    const theme = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            setOffsetTop(ref.current.offsetTop);
        }
    }, []);
    useEffect(() => {
        collapse(open);
    }, [open]);
    return (
        <Paper
            key={item.id}
            elevation={0}
            ref={ref}
            sx={{
                borderTop: `4px solid ${(theme?.palette[item.color as keyof typeof theme.palette] as PaletteColor).main}`,
                boxShadow: "none",
                height: `calc(100vh - ${offsetTop + 100}px)`,
                overflowY: "auto",
                overflowX: "hidden",
                width: item.isLast ? 138 : !item.isMain && !open ? 42 : "100%",
                minWidth: item.isLast ? 138 : !item.isMain && !open ? 42 : "auto",
                [theme.breakpoints.down('md')]: {
                    width: '100%',
                    minWidth: 'auto',
                }
            }}
        >
            <Box
                sx={
                    item.isLast ||
                        item.isMain ||
                        isMobile ||
                        open ? {} : {
                        transform: "rotate(90deg)",
                        width: "140px",
                        mt: "45px",
                        ml: "-50px",
                    }
                }
            >
                <Box p={1} sx={{ display: "flex", alignItems: "center" }}>
                    {(item.action && !isMobile) && (
                        <IconButton onClick={() => setopen(!open)} size="small">
                            <Icon path="ic-flesh-droite" />
                        </IconButton>
                    )}

                    <Label
                        variant="filled"
                        color={item.color}
                        sx={{
                            color: item.isLast ? 'common.white' : "text.primary",
                            minWidth: "auto",
                            my: item.isMain && 0.4,
                            svg: {
                                mr: 1,
                                width: 14,
                                height: 14,
                                path: {
                                    fill: item.isLast ? theme.palette.common.white : theme.palette.text.primary,
                                },
                            },

                        }}
                    >
                        <Icon path={item.icon} />
                        {t(item.title)}
                    </Label>
                </Box>
            </Box>
            {(!item.isMain && !open && !item.isLast) ? null : <Divider />}
            {children}

        </Paper>
    )
}
export default ConsultationCard;

