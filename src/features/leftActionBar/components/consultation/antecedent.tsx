import {pxToRem} from "@themes/formatFontSize";
import {Button, CardContent, IconButton, List, ListItem, ListItemIcon, Stack, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import Icon from "@themes/urlIcon";
import Add from "@mui/icons-material/Add";
import ContentStyled from "./overrides/contantStyle";
import React from "react";

function Antecedent({...props}) {

    const {antecedent,
        t,
        patient,
        trigger,
        medical_entity,
        mutate,
        session,
        handleOpen,
        index,
        router} = props

    return (
        <ContentStyled
            key={`card-content-${antecedent}${index}`}
            style={{paddingBottom: pxToRem(15)}}>
            <CardContent
                style={{paddingBottom: pxToRem(0), paddingTop: "1rem"}}>
                {antecedent !=="way_of_life" && antecedent !== "allergic" && <Typography fontWeight={600}>{t(antecedent)}</Typography>}
                <List dense>
                    {patient.antecedents[antecedent].map(
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
                                    {item.response ? typeof item.response === "string" ? '(' + item.response + ')' : '(' + item.response[0].value + ')' : ''}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        console.log(antecedent, item);

                                        trigger(
                                            {
                                                method: "DELETE",
                                                url:`/api/medical-entity/${medical_entity.uuid}/patients/${patient.uuid}/antecedents/${item.uuid}/${router.locale}`,
                                                headers: {
                                                    ContentType: "multipart/form-data",
                                                    Authorization: `Bearer ${session?.accessToken}`,
                                                },
                                            },
                                            {
                                                revalidate: true,
                                                populateCache: true,
                                            }
                                        ).then(() => console.log("edit qualification"));
                                        mutate();
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
