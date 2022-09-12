import { Label } from '@features/label';
import { CardContent, IconButton, Stack, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React, { ReactElement, useState } from 'react'
import DocumentCardStyled from './overrides/documentCardStyle';
import { Popover } from "@features/popover";
import Icon from "@themes/urlIcon";
function DocumentCard({ ...props }) {
    const [openTooltip, setOpenTooltip] = useState<boolean>(false);
    const { data, t , onClick } = props;
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
            <CardContent onClick={onClick}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Label variant='filled' color='warning'>{t("consultationIP." + "in_progress")}</Label>
                    <Popover
                        open={openTooltip}
                        handleClose={() => setOpenTooltip(false)}
                        menuList={[
                            {
                                title: "print",
                                icon: <Icon color={"white"} path='ic-imprime' />,
                                action: "actionPrint",
                            },
                            {
                                title: "share",
                                icon: <Icon color={"white"} path='ic-send' />,
                                action: "actionShare",
                            },
                            {
                                title: "download",
                                icon: <Icon color={"white"} path='ic-dowlaodfile' />,
                                action: "actionDownload",
                            },
                            {
                                title: "delete",
                                icon: <Icon color={"white"} path='icdelete' />,
                                action: "actionDelete",
                            },
                        ]}
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
                        data.documentType === "Ordonnace" && "ic-traitement" ||
                        data.documentType == "type-2" && "ic-analyse" ||
                        data.documentType === "type-4" && "ic-img" ||
                        data.documentType !== "Ordonnace" && "ic-pdf" || ""
                    } />
                    <Typography variant='subtitle2' fontWeight={700}>
                        {data.title}
                    </Typography>
                </Stack>
            </CardContent>
        </DocumentCardStyled>
    )
}

export default DocumentCard