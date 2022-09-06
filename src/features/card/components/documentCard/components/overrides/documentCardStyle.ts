import { Card } from '@mui/material';
import { styled, alpha } from '@mui/material/styles'
const DocumentCardStyled = styled(Card)(({ theme }) => ({
    boxShadow: theme.customShadows.documentCard,
    border: 'none',
    ".MuiCardContent-root": {
        '.btn-more': {
            background: alpha(theme.palette.grey['A300'], 0.3),
            width: 24,
            height: 24,
            paddingBottom: 8,
            borderRadius: 5,
            '.react-svg > div': {
                lineHeight: 0,
            }
        },
        ".document-detail": {
            marginTop: theme.spacing(1),
            svg: {
                width: theme.spacing(10),
                height: theme.spacing(10),

            }
        },
        '.MuiTooltip-tooltip': {
            '.popover-item': {
                padding: theme.spacing(1) + "!important",
                svg: {
                    width: 20,
                    height: 20,
                },
                '&.list-delete': {
                    p: {
                        color: theme.palette.error.main,
                    },
                    svg: {
                        path: {
                            fill: theme.palette.error.main
                        }
                    }
                }
            }
        }
    }
}));
export default DocumentCardStyled