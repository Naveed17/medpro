import {pxToRem} from "@themes/formatFontSize";
import {
    Button,
    CardContent,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Stack,
    Tooltip,
    tooltipClasses,
    Typography
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import Icon from "@themes/urlIcon";
import Add from "@mui/icons-material/Add";
import ContentStyled from "./overrides/contantStyle";
import React from "react";
import {styled} from "@mui/system";
import {TooltipProps} from "@mui/material/Tooltip";

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

    const HtmlTooltip = styled(({className, ...props}: TooltipProps) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            border: '1px solid #dadde9',
        },
    }));
    const isObject = (val: any) => {
        if (val === null) { return false;}
        return typeof val === 'object' && !Array.isArray(val)
    }

    return (
        <ContentStyled
            key={`card-content-${antecedent}${index}`}
            style={{paddingBottom: pxToRem(15)}}>
            <CardContent
                style={{paddingBottom: pxToRem(0), paddingTop: "1rem"}}>
                {antecedent !== "way_of_life" && antecedent !== "allergic" &&
                    <Typography className={"title"}>{allAntecedents.find((ant: { slug: any; }) => ant.slug === antecedent).name}</Typography>}
                <List dense>
                    {patientAntecedents && Array.isArray(patientAntecedents[antecedent]) && patientAntecedents[antecedent] && patientAntecedents[antecedent]?.map(
                        (
                            item: {
                                uuid: string;
                                name: string;
                                startDate: string;
                                endDate: string;
                                note:string;
                                ascendantOf: string;
                                response: string | any[]
                            },
                            index: number
                        ) => (
                            <ListItem key={`list-${index}`}>
                                <ListItemIcon>
                                    <CircleIcon/>
                                </ListItemIcon>
                                <HtmlTooltip
                                    title={
                                        <React.Fragment>
                                            <Typography color="gray" fontWeight={"bold"} fontSize={12}>{item.name}</Typography>
                                            <Typography color="gray" fontSize={12}>Date début : {item.startDate ? item.startDate: "-"}</Typography>
                                            <Typography color="gray" fontSize={12}>Date fin : {item.endDate ? item.endDate: "-"}</Typography>
                                            {item.ascendantOf && <Typography color="gray" fontSize={12}>{item.ascendantOf}</Typography>}
                                            <Typography color="gray" fontSize={12}>Note : {item.response ? typeof item.response === "string" ? item.response : item.response.length > 0 ?  item.response[0]?.value  : '-' : '-'}</Typography>
                                            {item.note  && <Typography color="gray" fontSize={12}>RQ : {item.note}</Typography>}
                                            {isObject(item.response) &&  Object.keys(item.response).map((rep:any) =>(
                                                <Typography color="gray" fontSize={12} key={rep}>{rep} : {item.response[rep]}</Typography>
                                            ))}
                                        </React.Fragment>
                                    }
                                >
                                <Typography variant="body2" style={{cursor: 'pointer'}} color="text.secondary">
                                    {item.name}{" "}
                                    {item.startDate ? " / " + item.startDate : ""}{" "}
                                    {item.endDate ? " - " + item.endDate : ""}
                                    {(item as any).ascendantOf && `(${t((item as any).ascendantOf)})`}
                                    {item.response ? typeof item.response === "string" ? '(' + item.response + ')' : item.response.length > 0 ? '(' + item.response[0]?.value + ')' : '' : ''}
                                </Typography>
                                </HtmlTooltip>
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
