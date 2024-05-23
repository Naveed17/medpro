import React from 'react'
import RootStyled from './overrides/rootStyle'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { CustomIconButton } from '@features/buttons'
import IconUrl from '@themes/urlIcon'
import { DesktopContainer } from '@themes/desktopConainter'
import { Otable } from '@features/table'
import { MobileContainer } from '@themes/mobileContainer'
import { TransactionsMobileCard } from '@features/card'
const TableHead = [
    {
        id: "date",
        label: "date",
        align: "left",
        sortable: true,
    },
    {
        id: "paymentMethod",
        label: "payment_method",
        align: "left",
        sortable: true,
    },
    {
        id: "used",
        label: "used",
        align: "left",
        sortable: true,
    },
    {
        id: "amount",
        label: "amount",
        align: "left",
        sortable: true,
    },
];
function Payments({ ...props }) {
    const { t, theme } = props
    return (
        <RootStyled className='payments-panel'>
            <Card>
                <CardHeader
                    title={<Typography variant='subtitle1' fontWeight={600}>
                        {t("transactions")}
                    </Typography>}
                    action={
                        <CustomIconButton color="primary">
                            <IconUrl path="ic-plus" width={16} height={16} color={theme.palette.common.white} />
                        </CustomIconButton>

                    }
                />
                <CardContent>
                    <DesktopContainer>
                        <Otable
                            {...{ t }}
                            headers={TableHead}
                            rows={[1, 3]}
                            from={"transactions"}
                        />
                    </DesktopContainer>
                    <MobileContainer>
                        <TransactionsMobileCard {...{ t }} />
                    </MobileContainer>
                </CardContent>
            </Card>
        </RootStyled>
    )
}

export default Payments