// components
import { Typography, ListItem, List, Stack, ListItemIcon, CardContent, IconButton, Button, DialogActions } from "@mui/material";
import Icon from "@themes/urlIcon";
import { useTranslation } from "next-i18next";
import ContentStyled from "./overrides/contantStyle";
import CircleIcon from '@mui/icons-material/Circle';
import { Dialog } from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { upperFirst } from "lodash";
import Add from "@mui/icons-material/Add";

const Content = ({ ...props }) => {
    const { id } = props;
    const { t, ready } = useTranslation('consultation', { keyPrefix: 'filter' });
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
        switch (action) {
            case "add_treatment":
                setInfo('add_treatment')
                break;
            default:
                setInfo(null)
                break;

        };
        handleClickDialog()

    };
    return (
        <ContentStyled>
            <CardContent>
                {id === 1 &&
                    <Stack spacing={1} alignItems="flex-start">
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <CircleIcon />
                                </ListItemIcon>
                                <Typography variant="body2" color="text.secondary">
                                    fdsfsad
                                </Typography>
                                <IconButton size="small" sx={{ ml: 'auto' }}>
                                    <Icon path="setting/icdelete" />
                                </IconButton>
                            </ListItem>
                        </List>
                        <Button onClick={() => handleOpen("add_treatment")} size="small" startIcon={
                            <Add />
                        }>
                            Ajouter
                        </Button>
                    </Stack>
                }

            </CardContent>
            {
                info &&
                <Dialog action={info}
                    open={openDialog}
                    data={null}
                    change={false}
                    max
                    direction={'ltr'}
                    actions={true}
                    title={t(info)}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialog}
                                startIcon={<CloseIcon />}>
                                {t('cancel')}
                            </Button>
                            <Button variant="contained"
                                onClick={handleCloseDialog}

                                startIcon={<Icon
                                    path='ic-dowlaodfile' />}>
                                {t('save')}
                            </Button>
                        </DialogActions>
                    } />
            }

        </ContentStyled>
    )
}
export default Content


