import React from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import QRCode from "react-qr-code";
import QrCodeDialogStyled from './overrides/qrCodeScannerStyle'
import { Theme } from '@mui/material/styles'

function QRCodeScanner({ value, width, height }: { value: string; width: number; height: number }) {
    const theme = useTheme() as Theme
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <QrCodeDialogStyled sx={{
            width,
            height,
            [theme.breakpoints.down("sm")]: {
                width: width - 10,
                height: height - 10
            },
        }}>
            <Box className='code-wrapper' />
            <QRCode size={isMobile ? width - 30 : width - 20} value={value} />
        </QrCodeDialogStyled>
    )
}

export default QRCodeScanner
