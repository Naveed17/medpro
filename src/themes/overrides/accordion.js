import { alpha } from "@mui/material/styles";
export default function Accordion(theme) {
    return {
        MuiAccordion: {
            styleOverrides: {
                root: {
                    border: `1px solid ${theme.palette.divider}`,
                    borderLeft: 0,
                    borderRight: 0,
                    '&:not(:last-child)': {
                        borderBottom: 0,
                    },
                    '&:before': {
                        display: 'none',
                    },
                    '& .MuiAccordionSummary-root': {
                        paddingLeft: 0,
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.paper, 0.5)
                                : 'transparent',
                        '&:hover': {
                            backgroundColor: theme.palette.info.main,
                        },
                        '&.Mui-expanded': {
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                        },
                        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                            transform: 'rotate(0deg)',
                        },
                        '& .MuiAccordionSummary-content': {
                            marginLeft: theme.spacing(1),
                        },
                    },
                    '& .MuiAccordionDetails-root': {
                        padding: theme.spacing(2),
                    },
                    '&.Mui-expanded': {
                        marginTop: 0,
                    }
                },
            },
        },
    };
}