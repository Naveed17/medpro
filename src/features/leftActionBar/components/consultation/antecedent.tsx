import {pxToRem} from "@themes/formatFontSize";
import {Button, CardContent, IconButton, List, ListItem, ListItemIcon, Stack, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
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
                                antecedent:{multiple:boolean};
                            },
                            index: number
                        ) => (
                            <ListItem key={`list-${index}`}>
                                <ListItemIcon>
                                    <CircleIcon/>
                                </ListItemIcon>
                                <Typography variant="body2" style={{cursor: 'pointer'}} color="text.secondary">
                                    {item.name}{" "}
                                    {item.startDate ? " / " + item.startDate : ""}{" "}
                                    {item.endDate ? " - " + item.endDate : ""}
                                    {(item as any).ascendantOf && `(${t((item as any).ascendantOf)})`}
{/*
                                    {item.response ? typeof item.response === "string" ? '(' + item.response + ')' : item.response.length > 0 ? '(' + item.response[0]?.value + ')' : '' : ''}
*/}
                                    {item.note && ` ( ${item.note} )`}
                                </Typography>
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
                                                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/antecedents/${item.uuid}/${router.locale}`
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
