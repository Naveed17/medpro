import {Box, Button, Checkbox, DialogActions, FormControlLabel, Stack} from "@mui/material";
import Icon from "@themes/urlIcon";
import Add from "@mui/icons-material/Add";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useSWRConfig} from "swr";
import {cashBoxSelector, setSelectedBoxes} from "@features/leftActionBar/components/cashbox";

function BoxsesFilter() {

    const {
        cashboxes,
        selectedBoxes
    } = useAppSelector(cashBoxSelector);

    const {t} = useTranslation('payment', {keyPrefix: 'filter'});
    const {mutate} = useSWRConfig();

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [cashName, setCashName] = useState("");

    const {trigger} = useRequestMutation(null, "/payment/cashbox", {revalidate: true, populateCache: false});

    /*    const removeCash = (uuid: string) => {
            trigger({
                method: "DELETE",
                url: `${urlMedicalEntitySuffix}/cash-boxes/${uuid}/${router.locale}`
            }).then(() => {
                setOpenDialog(false);
                mutate(`${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`).then(() => setCashName(''));
            });
        }*/
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleSaveDialog = () => {
        const form = new FormData();
        form.append("name", cashName);

        trigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`,
            data: form
        }).then(() => {
            setOpenDialog(false);
            mutate(`${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`).then(() => setCashName(''));
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
                                checked={selectedBoxes.some((sb: { uuid: any; }) => sb.uuid === cb.uuid)}
                                onChange={() => {
                                    const index = selectedBoxes.findIndex((sb: { uuid: any; }) => sb.uuid === cb.uuid)
                                    let boxes = [...selectedBoxes]
                                    if (index >= 0 && boxes.length > 1) {
                                        boxes.splice(index, 1)
                                    } else {
                                        boxes.push(cb);
                                    }
                                    dispatch(setSelectedBoxes(boxes));
                                }}
                            />
                        }
                    />
                    {/*<IconButton size={"small"} onClick={() => {
                        removeCash(cb.uuid)
                    }} style={{width: 25, height: 25}}>
                        <IconUrl path='icdelete' width={15} height={15}
                                 color={theme.palette.error.main}/>
                    </IconButton>*/}
                </Stack>

            ))}
            {selectedBoxes.length === 0 && <Button
                onClick={() => {
                    setOpenDialog(true);
                }}
                size="small"
                startIcon={<Add/>}>
                {t('add')}
            </Button>}

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
