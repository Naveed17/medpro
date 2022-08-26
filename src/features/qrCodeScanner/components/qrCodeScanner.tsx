import React from 'react'
import { Box, useMediaQuery } from '@mui/material'
import QRCode from "react-qr-code";
import QrCodeDialogStyled from './overrides/qrCodeScannerStyle'
import { Theme } from '@mui/material/styles'

function QRCodeScanner({ value }: { value: string }) {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <QrCodeDialogStyled>
            <Box className='code-wrapper' />
            <QRCode size={isMobile ? 150 : 160} value={value} />
        </QrCodeDialogStyled>
    )
}

export default QRCodeScanner
