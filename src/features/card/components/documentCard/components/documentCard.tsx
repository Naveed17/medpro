import {CardContent, IconButton, Stack, Typography} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React, {ReactElement, useState} from 'react'
import DocumentCardStyled from './overrides/documentCardStyle';
import {Popover} from "@features/popover";
import Icon from "@themes/urlIcon";

function DocumentCard({...props}) {
    const [openTooltip, setOpenTooltip] = useState<boolean>(false);
    const {data, onClick,t} = props;
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
                {/*  <Stack direction="row" alignItems="center" justifyContent="end">

                    <Label variant='filled' color='warning'>{t("consultationIP." + "in_progress")}</Label>

                    <Popover
                        open={openTooltip}
                        handleClose={() => {
                            setOpenTooltip(false)
                        }}
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
                                onClick={(ev) => {
                                    ev.stopPropagation()
                                    setOpenTooltip(true);
                                }}
                                size="small" className="btn-more">
                                <IconUrl path='ic-more-h' />
                            </IconButton>
                        }
                    />

                </Stack>
                */}
                <Stack spacing={2} className="document-detail" alignItems="center">
                    <IconUrl path={
                        data.documentType === "prescription" && "ic-traitement" ||
                        data.documentType == "requested-analysis" && "ic-analyse" ||
                        data.documentType == "analyse" && "ic-analyse" ||
                        data.documentType == "medical-imaging" && "ic-soura" ||
                        data.documentType == "requested-medical-imaging" && "ic-soura" ||
                        data.documentType === "photo" && "ic-img" ||
                        data.documentType === "Rapport" && "ic-text" ||
                        data.documentType === "medical-certificate" && "ic-text" ||
                        data.documentType === "video" && "ic-video-outline" ||
                        data.documentType !== "prescription" && "ic-pdf" || ""
                    }/>
                    <Typography variant='subtitle2' fontWeight={700} textAlign={"center"} fontSize={12}>
                        {t(data.title)}
                    </Typography>
                </Stack>
            </CardContent>
        </DocumentCardStyled>
    )
}

export default DocumentCard