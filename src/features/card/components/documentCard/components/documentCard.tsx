import { Label } from '@features/label';
import { CardContent, IconButton, Stack, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React, { ReactElement, useState } from 'react'
import DocumentCardStyled from './overrides/documentCardStyle';
import { Popover } from "@features/popover";
function DocumentCard({ ...props }) {
    const [openTooltip, setOpenTooltip] = useState<boolean>(false);
    const { data, t } = props;
    const onClickTooltipItem = (item: {
        title: string;
        icon: ReactElement | null;
        action: string;
    }) => {
        switch (item.action) {
            case "actionDelete":
                console.log("actionDelete");
                break;
        }
    };
    return (
        <DocumentCardStyled>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Label variant='filled' color='warning'>{t("consultationIP." + data.status)}</Label>
                    <Popover
                        open={openTooltip}
                        handleClose={() => setOpenTooltip(false)}
                        menuList={data.options}
                        onClickItem={onClickTooltipItem}
                        button={
                            <IconButton
                                onClick={() => {
                                    setOpenTooltip(true);
                                }}
                                size="small" className="btn-more">
                                <IconUrl path='ic-more-h' />
                            </IconButton>
                        }
                    />

                </Stack>
                <Stack spacing={2} className="document-detail" alignItems="center">
                    <IconUrl path={
                        data.documentType === "type-1" && "ic-traitement" ||
                        data.documentType === "type-2" && "ic-analyse" ||
                        data.documentType === "type-3" && "ic-pdf" ||
                        data.documentType === "type-4" && "ic-img" ||
                        ""
                    } />
                    <Typography variant='subtitle2' fontWeight={700}>
                        {data.name}
                    </Typography>
                </Stack>
            </CardContent>
        </DocumentCardStyled>
    )
}

export default DocumentCard