import {pxToRem} from "@themes/formatFontSize";
import {Button, CardContent, IconButton, List, ListItem, Stack, Typography} from "@mui/material";
import Icon from "@themes/urlIcon";
import Add from "@mui/icons-material/Add";
import ContentStyled from "./overrides/contantStyle";
import React from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";

function Antecedent({...props}) {

    const {
        antecedent,
        patientAntecedents,
        allAntecedents,
        t,
        patient,
        setSelected,
        handleOpen,
        setOpenRemove,
        index,
        router
    } = props
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    return (
        <ContentStyled
            key={`card-content-${antecedent}${index}`}
            style={{paddingBottom: pxToRem(15)}}>
            <CardContent
                style={{paddingBottom: pxToRem(0), paddingTop: "1rem"}}>
                {antecedent !== "way_of_life" && antecedent !== "allergic" &&
                    <Typography className={"title"}>{allAntecedents.find((ant: {
                        slug: any;
                    }) => ant.slug === antecedent).name}</Typography>}
                <List dense>
                    {patientAntecedents && Array.isArray(patientAntecedents[antecedent]) && patientAntecedents[antecedent] && patientAntecedents[antecedent]?.map(
                        (
                            item: {
                                uuid: string;
                                name: string;
                                startDate: string;
                                endDate: string;
                                note: string;
                                ascendantOf: string;
                                response: string | any[];
                                antecedent: { multiple: boolean };
                            },
                            index: number
                        ) => (
                            <ListItem
                                style={{border: "1px dashed #DDD", borderRadius: 5, marginTop: 5, paddingLeft: 10}}
                                key={`list-${index}`}>
                                <Stack spacing={1}>
                                    <Typography variant="body2" style={{cursor: 'pointer'}}>
                                        {item.name}{" "}<span>{item.response ? typeof item.response === "string" ? !item.response.includes("{") && ' | ' + item.response : item.response.length > 0 ? ' | ' + item.response[0]?.value : '' : ''}</span>
                                        {item.note && <span>{` | ${item.note}`}</span>}
                                    </Typography>
                                    {item.ascendantOf && <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                        <Icon path="ic-user2" height={11} width={11}/>
                                        <Typography fontSize={11}
                                                    fontWeight={"bold"}>{`${t(item.ascendantOf)}`}</Typography>
                                    </Stack>}
                                    {(item.startDate || item.endDate) &&
                                        <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                            {item.startDate &&
                                                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                                    <Icon path="ic-agenda" height={11} width={11}/>
                                                    <Typography fontSize={11}>{t('start')} <span
                                                        style={{fontWeight: "bold"}}>{item.startDate}</span></Typography>
                                                </Stack>}
                                            {item.endDate && <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                                <Icon path="ic-agenda" height={11} width={11}/>
                                                <Typography fontSize={11}>{t('end')} <span
                                                    style={{fontWeight: "bold"}}>{item.endDate}</span></Typography>
                                            </Stack>}
                                        </Stack>}
                                </Stack>


                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        medicalEntityHasUser && setSelected({
                                            title: t('askRemove'),
                                            subtitle: "",
                                            icon: "/static/icons/ic-recherche.svg",
                                            name1: item.name,
                                            name2: "",
                                            request: {
                                                method: "DELETE",
                                                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/antecedents/${item.uuid}/${router.locale}`
                                            }
                                        })
                                        setOpenRemove(true);
                                    }}
                                    sx={{ml: "auto"}}>
                                    <Icon path="setting/icdelete"/>
                                </IconButton>
                            </ListItem>
                        )
                    )}
                </List>
                <Stack mt={2} alignItems="flex-start">
                    <Button
                        onClick={() => handleOpen(antecedent)}
                        size="small"
                        startIcon={<Add/>}>
                        {t("add")}
                    </Button>
                </Stack>
            </CardContent>
        </ContentStyled>
    )

}

export default Antecedent;
