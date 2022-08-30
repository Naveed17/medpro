// components
import {
    Typography,
    ListItem,
    List,
    Stack,
    ListItemIcon,
    CardContent,
    IconButton,
    Button,
    DialogActions
} from "@mui/material";
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import ContentStyled from "./overrides/contantStyle";
import CircleIcon from '@mui/icons-material/Circle';
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import Add from "@mui/icons-material/Add";
import {data2, data3} from './config'
import {useAppDispatch} from "@app/redux/hooks";
import {openDrawer} from "@features/calendar";
import {pxToRem} from "@themes/formatFontSize";


const Content = ({...props}) => {
    const {id, patient} = props;
    const {t, ready} = useTranslation('consultation', {keyPrefix: 'filter'});
    const dispatch = useAppDispatch();
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [info, setInfo] = React.useState<null | string>('');
    const handleClickDialog = () => {
        setOpenDialog(true);

    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null)
    }
    const handleOpen = (action: string) => {
        if (action === "consultation") {
            dispatch(openDrawer({type: "add", open: true}));
            return
        }
        setInfo(action)
        /*        switch (action) {
                    case "add_treatment":
                        setInfo(action)
                        break;
                    case "balance_sheet_pending":
                        setInfo(action)
                        break;
                    case "wa":
                        setInfo(action)
                        break;
                    case "family_history":
                        setInfo(action)
                        break;
                    case "surgical_history":
                        setInfo(action)
                        break;
                    default:
                        setInfo(null)
                        break;

                }*/
        handleClickDialog()

    };

    if (!ready) return <>loading translations...</>;
    return (
        <React.Fragment>
            {
                id !== 4 ?
                    <ContentStyled>
                        <CardContent style={{paddingBottom: pxToRem(15)}}>
                            {id === 1 &&
                                <Stack spacing={1} alignItems="flex-start">
                                    <List dense>
                                        {
                                            [].map((list: any, index: number) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon/>
                                                    </ListItemIcon>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {list.name} / {list.duration} {t(list.dosage)}
                                                    </Typography>
                                                    <IconButton size="small" sx={{ml: 'auto'}}>
                                                        <Icon path="setting/icdelete"/>
                                                    </IconButton>
                                                </ListItem>
                                            )
                                        }

                                    </List>
                                    <Button onClick={() => handleOpen("add_treatment")} size="small"
                                            style={{paddingBottom: pxToRem(0)}}
                                            startIcon={<Add/>}>
                                        {t('add')}
                                    </Button>
                                </Stack>
                            }
                            {id === 2 &&
                                <Stack spacing={2} alignItems="flex-start">
                                    <List dense>
                                        {
                                            data2.map((list, index) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon/>
                                                    </ListItemIcon>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {list.name}
                                                    </Typography>
                                                </ListItem>
                                            )
                                        }

                                    </List>
                                    <Stack direction="row" spacing={2}>
                                        <Button onClick={() => handleOpen("balance_sheet_pending")} size="small"
                                                startIcon={
                                                    <Add/>
                                                }>
                                            {t('add_result')}
                                        </Button>
                                        <Button color="error" size="small" startIcon={
                                            <Icon path="setting/icdelete"/>
                                        }>
                                            {t('ignore')}
                                        </Button>
                                    </Stack>
                                </Stack>
                            }
                            {id === 3 &&
                                <Stack spacing={1} alignItems="flex-start">
                                    <List dense>
                                        {
                                            data3.map((list, index) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon/>
                                                    </ListItemIcon>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {list.date}
                                                    </Typography>
                                                </ListItem>
                                            )
                                        }

                                    </List>
                                    <Stack mt={2}>
                                        <Button onClick={() => handleOpen("consultation")} size="small" startIcon={
                                            <Add/>
                                        }>
                                            {t('add')}
                                        </Button>
                                    </Stack>
                                </Stack>
                            }

                        </CardContent>
                    </ContentStyled> :
                    patient && Object.keys(patient.antecedents).map((antecedent, idx: number) =>
                        <ContentStyled key={`card-${idx}`} style={{paddingBottom: pxToRem(15)}}>
                            <CardContent style={{paddingBottom: pxToRem(0), paddingTop: '1rem'}}>
                                <Typography fontWeight={600}>
                                    {t(antecedent)}

                                </Typography>

                                <List dense>
                                    {
                                        patient.antecedents[antecedent].map((item: { name: string }, index: number) =>
                                            <ListItem key={`list-${index}`}>
                                                <ListItemIcon>
                                                    <CircleIcon/>
                                                </ListItemIcon>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.name}
                                                </Typography>
                                                <IconButton size="small" sx={{ml: 'auto'}}>
                                                    <Icon path="setting/icdelete"/>
                                                </IconButton>
                                            </ListItem>
                                        )
                                    }

                                </List>
                                <Stack mt={2} alignItems="flex-start">
                                    <Button onClick={() => handleOpen(antecedent)} size="small" startIcon={
                                        <Add/>
                                    }>
                                        {antecedent === "way_of_life" ? t('add') : t("add_history")}
                                    </Button>
                                </Stack>

                            </CardContent>
                        </ContentStyled>
                    )

            }
            {
                info &&
                <Dialog action={info}
                        open={openDialog}
                        data={{data: patient.antecedents[info], action: info}}
                        change={false}
                        max
                        direction={'ltr'}
                        actions={true}
                        title={t(info)}
                        dialogClose={handleCloseDialog}
                        actionDialog={
                            <DialogActions>
                                <Button onClick={handleCloseDialog}
                                        startIcon={<CloseIcon/>}>
                                    {t('cancel')}
                                </Button>
                                <Button variant="contained"
                                        onClick={handleCloseDialog}

                                        startIcon={<Icon
                                            path='ic-dowlaodfile'/>}>
                                    {t('save')}
                                </Button>
                            </DialogActions>
                        }/>
            }

        </React.Fragment>
    )
}
export default Content


