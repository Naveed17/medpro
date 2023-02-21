import {Card, CardContent, Stack, Typography} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React from 'react'
import DocumentCardStyled from './overrides/documentCardStyle';
import moment from "moment/moment";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function DocumentCard({...props}) {
    //const [openTooltip, setOpenTooltip] = useState<boolean>(false);
    const {data, onClick, t} = props;
    /*const onClickTooltipItem = (item: {
        title: string;
        icon: ReactElement | null;
        action: string;
    }) => {
        switch (item.action) {
            case "actionDelete":
                console.log("actionDelete");
                break;
        }
    };*/
    return (
        <>
            {data.documentType !== "photo" && <DocumentCardStyled className={"document-card"}>
                <CardContent style={{padding: "2px 15px 10px"}} onClick={onClick}>
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
                    <Stack spacing={2}
                           direction={"row"}
                           className="document-detail"
                           alignItems="center">
                        <IconUrl width={"20"} height={"20"} path={
                            data.documentType === "prescription" && "ic-traitement" ||
                            data.documentType == "requested-analysis" && "ic-analyse" ||
                            data.documentType == "analyse" && "ic-analyse" ||
                            data.documentType == "medical-imaging" && "ic-soura" ||
                            data.documentType == "requested-medical-imaging" && "ic-soura" ||
                            data.documentType === "photo" && "ic-img" ||
                            data.documentType === "audio" && "ic-son" ||
                            data.documentType === "Rapport" && "ic-text" ||
                            data.documentType === "medical-certificate" && "ic-text" ||
                            data.documentType === "video" && "ic-video-outline" ||
                            data.documentType !== "prescription" && "ic-pdf" || ""
                        }/>
                        <Stack direction={"column"}>
                            <Typography className={"sub-title"} variant='subtitle2'
                                        whiteSpace={"nowrap"}
                                        style={{cursor:"pointer"}}
                                        fontSize={13}>
                                {t(data.title)}
                            </Typography>
                            <Stack direction={"row"} spacing={1}>
                                <AccessTimeIcon style={{fontSize: 15, color: "grey"}}/>
                                <Typography whiteSpace={"nowrap"} fontSize={12}
                                            style={{marginTop: 0, color: "grey",cursor:"pointer"}}>
                                    {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1,"hour").format('HH:mm')}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>
            </DocumentCardStyled>}
            {data.documentType === "photo" &&
                <Card onClick={onClick} style={{border: 0, boxShadow: "none"}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.uri}
                         style={{borderRadius: 5, width: '100%', height: '100%'}}
                         alt={'photo history'}/>
                </Card>
            }
        </>
    )
}

export default DocumentCard
