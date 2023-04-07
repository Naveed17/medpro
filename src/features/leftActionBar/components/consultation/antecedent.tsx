import {pxToRem} from "@themes/formatFontSize";
import {Button, CardContent, IconButton, List, ListItem, ListItemIcon, Stack, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import Icon from "@themes/urlIcon";
import Add from "@mui/icons-material/Add";
import ContentStyled from "./overrides/contantStyle";
import React from "react";

function Antecedent({...props}) {

    const {
        antecedent,
        patientAntecedents,
        allAntecedents,
        t,
        patient,
        medical_entity,
        setSelected,
        session,
        handleOpen,
        setOpenRemove,
        index,
        router
    } = props

    return (
        <ContentStyled
            key={`card-content-${antecedent}${index}`}
            style={{paddingBottom: pxToRem(15)}}>
            <CardContent
                style={{paddingBottom: pxToRem(0), paddingTop: "1rem"}}>
                {antecedent !== "way_of_life" && antecedent !== "allergic" &&
                    <Typography fontWeight={600}>{allAntecedents.find((ant: { slug: any; }) => ant.slug === antecedent).type ?t(antecedent):antecedent}</Typography>}
                <List dense>
                    {patientAntecedents && Array.isArray(patientAntecedents[antecedent]) && patientAntecedents[antecedent] && patientAntecedents[antecedent]?.map(
                        (
                            item: {
                                uuid: string;
                                name: string;
                                startDate: string;
                                endDate: string;
                                response: string | any[]
                            },
                            index: number
                        ) => (
                            <ListItem key={`list-${index}`}>
                                <ListItemIcon>
                                    <CircleIcon/>
                                </ListItemIcon>
                                <Typography variant="body2" color="text.secondary">
                                    {item.name}{" "}
                                    {item.startDate ? " / " + item.startDate : ""}{" "}
                                    {item.endDate ? " - " + item.endDate : ""}
                                    {(item as any).ascendantOf && `(${t((item as any).ascendantOf)})`}
                                    {item.response ? typeof item.response === "string" ? '(' + item.response + ')' : item.response.length > 0 ? '(' + item.response[0]?.value + ')' : '' : ''}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setSelected({
                                            title: t('askRemove'),
                                            subtitle: t(antecedent),
                                            icon: "/static/icons/ic-recherche.svg",
                                            name1: item.name,
                                            name2: "",
                                            request: {
                                                method: "DELETE",
                                                url: `/api/medical-entity/${medical_entity.uuid}/patients/${patient.uuid}/antecedents/${item.uuid}/${router.locale}`,
                                                headers: {
                                                    ContentType: "multipart/form-data",
                                                    Authorization: `Bearer ${session?.accessToken}`,
                                                },
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
                        {antecedent === "way_of_life" || antecedent === "allergic" ? t("add") : t("add_history")}
                    </Button>
                </Stack>
            </CardContent>
        </ContentStyled>
    )

}

export default Antecedent;
