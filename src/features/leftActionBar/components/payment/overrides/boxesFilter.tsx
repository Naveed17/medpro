import {Box, Button, Checkbox, DialogActions, FormControlLabel, IconButton, Stack, useTheme} from "@mui/material";
import {setCashBox} from "@features/leftActionBar/components/payment/actions";
import IconUrl from "@themes/urlIcon";
import Add from "@mui/icons-material/Add";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar/components/payment/selectors";
import {useMedicalEntitySuffix} from "@app/hooks";
import {useSession} from "next-auth/react";

function BoxsesFilter({...props}) {
    const {cashboxes, setCashboxes} = props;
    const theme = useTheme();
    const {data: session} = useSession();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {t} = useTranslation('payment', {keyPrefix: 'filter'});
    const {selectedBox} = useAppSelector(cashBoxSelector);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [cashName, setCashName] = useState("");

    const {trigger} = useRequestMutation(null, "/payment/cashbox", {revalidate: true, populateCache: false});

    const {data: httpBoxesResponse, mutate} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`,
        headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

    useEffect(() => {
        if (httpBoxesResponse) {
            setCashboxes((httpBoxesResponse as HttpResponse).data)
        }
    }, [httpBoxesResponse, setCashboxes]);

    const removeCash = (uuid: string) => {
        trigger({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/cash-boxes/${uuid}/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then((r: any) => {
            console.log(r)
            setOpenDialog(false);
            mutate().then(() => setCashName(''));
        });
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleSaveDialog = () => {
        const form = new FormData();
        form.append("name", cashName);

        trigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then((r: any) => {
            console.log(r)
            setOpenDialog(false);
            mutate().then(() => setCashName(''));
        });
    }


    return (
        <Box>
            {cashboxes.map((cb: any, id: number) => (
                <Stack direction={"row"} justifyContent={"space-between"} key={`cash-box-${id}`}>
                    <FormControlLabel
                        label={`${cb.name}`}
                        control={
                            <Checkbox
                                checked={cb.uuid === selectedBox?.uuid}
                                onChange={() => {
                                    dispatch(setCashBox(cb));
                                }}
                            />
                        }
                    />
                    <IconButton size={"small"} onClick={() => {
                        removeCash(cb.uuid)
                    }} style={{width: 25, height: 25}}>
                        <IconUrl path='icdelete' width={15} height={15}
                                 color={theme.palette.error.main}/>
                    </IconButton>
                </Stack>

            ))}
            <Button
                onClick={() => {
                    setOpenDialog(true);
                }}
                size="small"
                startIcon={<Add/>}>
                {t('add')}
            </Button>

            <Dialog action={'createCashBox'}
                    open={openDialog}
                    data={{cashName, setCashName}}
                    change={false}
                    max
                    size={"sm"}
                    direction={'ltr'}
                    actions={true}
                    title={t('newCash')}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialog}
                                    startIcon={<CloseIcon/>}>
                                {t('cancel')}
                            </Button>
                            <Button variant="contained"
                                    onClick={handleSaveDialog}
                                    disabled={cashName.length === 0}
                                    startIcon={<Icon
                                        path='ic-dowlaodfile'/>}>
                                {t('save')}
                            </Button>
                        </DialogActions>
                    }/>
        </Box>
    )
}

export default BoxsesFilter
