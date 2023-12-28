import {styled} from "@mui/material/styles";

const ChartStyled = styled('div')(({theme}) => ({
    // Tooltip
    '.apexcharts-tooltip,.apexcharts-xaxistooltip': {
        border: '0 !important',
        color: `${theme.palette.text.primary} !important`,
        borderRadius: `1px !important`,
        backgroundColor: `${theme.palette.background.default} !important`
    },
    '.apexcharts-tooltip-title': {
        border: '0 !important',
        fontWeight: theme.typography.fontWeightBold,
        backgroundColor: `${theme.palette.grey["500_16"]} !important`,
        color:
            theme.palette.text[
                theme.palette.mode === 'light' ? 'secondary' : 'primary'
                ]
    },
    '.apexcharts-xaxistooltip-bottom': {
        '&:before': {
            borderBottomColor: 'transparent !important'
        },
        '&:after': {
            borderBottomColor: `${theme.palette.background.paper} !important`
        }
    },

    // Legend
    '.apexcharts-legend': {
        padding: '0 !important'
    },
    '.apexcharts-legend-series': {
        alignItems: 'center',
        display: 'flex !important'
    },
    '.apexcharts-legend-marker': {
        marginTop: '2px !important',
        marginRight: '8px !important'
    },
    '.apexcharts-legend-text': {
        lineHeight: '18px',
        color: `${theme.palette.text.secondary} !important`,
        textTransform: 'capitalize'
    }
}));

export default ChartStyled;
