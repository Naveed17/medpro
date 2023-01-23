// components
import {ActionBarState, BoxStyled, FilterRootStyled, PatientFilter} from "@features/leftActionBar";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, DayOfWeek} from "@features/calendar";
import moment from "moment-timezone";
import {Accordion} from "@features/accordion";
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    DialogActions,
    FormControlLabel,
    IconButton,
    Stack,
    TextField,
    useTheme
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import ItemCheckbox from "@themes/overrides/itemCheckbox";
import {setCashBox} from "@features/leftActionBar/components/payment/actions";
import {Session} from "next-auth";
import Add from "@mui/icons-material/Add";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";

import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import DatePicker from "@mui/lab/DatePicker";

const CalendarPickers = dynamic(() =>
    import("@features/calendar/components/calendarPickers/components/calendarPickers"));

function Payment() {

    const paymentTypes = [
        {
            icon: 'ic-argent',
            name: 'cash'
        },
        {
            icon: 'ic-card',
            name: 'card'
        },
        {
            icon: 'ic-cheque',
            name: 'check'
        },
        {
            icon: 'ic-card',
            name: 'Alimentation'
        },
        {
            icon: 'ic-card',
            name: 'Encaissement'
        },

    ]
    const theme = useTheme();
    const {config: agendaConfig, sortedData: notes} = useAppSelector(agendaSelector);
    const locations = agendaConfig?.locations;
    const [disabledDay, setDisabledDay] = useState<number[]>([]);
    const [cashboxes, setCashboxes] = useState<CashBox[]>([]);
    const [cashName, setCashName] = useState("");

    const router = useRouter();
    const {data: session} = useSession();
    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }
    const [insurances, setInsurances] = useState<InsuranceModel[]>([]);
    const [selectedBox, setSelectedBox] = useState<CashBox | null>(null);
    const [filterDate, setFilterDate] = useState(true);
    const [byPeriod, setByPeriod] = useState(false);
    const dispatch = useAppDispatch();

    const hours = locations && locations[0].openingHours[0].openingHours;
    const newVersion = process.env.NODE_ENV === 'development';
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const {data: httpBoxesResponse, mutate} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/cash-boxes/${router.locale}`,
        headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });
    const {trigger} = useRequestMutation(null, "/payment/cashbox", {revalidate: true, populateCache: false});

    useEffect(() => {
        if (httpBoxesResponse) {
            setCashboxes((httpBoxesResponse as HttpResponse).data)
        }
    }, [httpBoxesResponse]);

    useEffect(() => {
        if (cashboxes.length > 0) {
            setSelectedBox(cashboxes[0]);
            dispatch(setCashBox(cashboxes[0]));
        }
    }, [cashboxes, dispatch])


    useEffect(() => {
        const disabledDay: number[] = []
        hours && Object.entries(hours).filter((openingHours: any) => {
            if (!(openingHours[1].length > 0)) {
                disabledDay.push(DayOfWeek(openingHours[0]));
            }
        });
        setDisabledDay(disabledDay);
    }, [hours]);

    useEffect(() => {
        console.log(selectedBox)
    }, [selectedBox])

    const {data} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale,
        headers
    });

    useEffect(() => {
        if (data !== undefined)
            setInsurances((data as any).data);
    }, [data]);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const removeCash = (uuid: string) => {
        trigger({
            method: "DELETE",
            url: `/api/medical-entity/${medical_entity.uuid}/cash-boxes/${uuid}/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then((r: any) => {
            console.log(r)
            setOpenDialog(false);
            mutate().then(() => setCashName(''));
        });

    }

    const handleSaveDialog = () => {
        const form = new FormData();
        form.append("name", cashName);

        trigger({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/cash-boxes/${router.locale}`,
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

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});

    return (
        <BoxStyled>
            <CalendarPickers
                renderDay
                {...{notes, disabled: !filterDate || byPeriod}}
                shouldDisableDate={(date: Date) => disabledDay.includes(moment(date).weekday())}/>


            {newVersion && <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                defaultValue={""}
                data={[
                    {
                        heading: {
                            id: "date",
                            icon: "ic-agenda-jour",
                            title: "date",
                        },
                        children: (

                            <Box>
                                <FormControlLabel
                                    label={`${t('filterByDate')}`}
                                    control={
                                        <Checkbox
                                            checked={filterDate}
                                            onChange={() => {
                                                setFilterDate(!filterDate);
                                            }}
                                        />
                                    }
                                />

                                <FormControlLabel
                                    label={`${t('filterByPeriod')}`}
                                    disabled={!filterDate}
                                    control={
                                        <Checkbox
                                            checked={byPeriod}
                                            onChange={() => {
                                                setByPeriod(!byPeriod);
                                            }}
                                        />
                                    }
                                />

                                <Collapse in={byPeriod && filterDate} timeout="auto" unmountOnExit>
                                    <Stack p={1} spacing={2}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                renderInput={(props) => <TextField {...props} />}
                                                label={t('startDate')}
                                                value={new Date()}
                                                onChange={(newValue) => {
                                                    //setValue(newValue);
                                                }}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                renderInput={(props) => <TextField {...props} />}
                                                label={t('endDate')}
                                                value={new Date()}
                                                onChange={(newValue) => {
                                                    //setValue(newValue);
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Collapse>
                            </Box>
                        ),
                    },
                    {
                        heading: {
                            id: "boxes",
                            icon: "ic-invoice",
                            title: "boxes",
                        },
                        children: (

                            <Box>
                                {cashboxes.map((cb, id) => (
                                    <Stack direction={"row"} justifyContent={"space-between"} key={`cash-box-${id}`}>
                                        <FormControlLabel
                                            label={`${cb.name}`}
                                            control={
                                                <Checkbox
                                                    checked={cb.uuid === selectedBox?.uuid}
                                                    onChange={() => {
                                                        setSelectedBox(cb)
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
                            </Box>
                        ),
                    },
                    {
                        heading: {
                            id: "facturation",
                            icon: "ic-invoice",
                            title: "facturationState",
                        },
                        children: (
                            <Stack direction={"row"}>
                                <FormControlLabel
                                    label={t('yes')}
                                    control={
                                        <Checkbox
                                            checked={false}
                                            // onChange={handleChange1}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    label={t('no')}
                                    control={
                                        <Checkbox
                                            checked={false}
                                        />
                                    }
                                />
                            </Stack>
                        ),
                    },
                    {
                        heading: {
                            id: "paymentType",
                            icon: "ic-argent",
                            title: "paymentType",
                        },
                        children: (
                            <Box>
                                {paymentTypes.map((item: any, index: number) => (
                                    <ItemCheckbox
                                        key={`pt${index}`}
                                        data={item}
                                        checked={
                                            false
                                        }
                                        onChange={(v: any) => {
                                            console.log(v)
                                        }}
                                    ></ItemCheckbox>))}
                            </Box>
                        ),
                    },
                    {
                        heading: {
                            id: "insurance",
                            icon: "ic-assurance",
                            title: "insurance",
                        },
                        children: (
                            <Box>
                                {insurances.map((item: any, index: number) => (
                                    <ItemCheckbox
                                        key={index}
                                        data={item}
                                        checked={
                                            false
                                        }
                                        onChange={(v: any) => {
                                            console.log(v)
                                        }}
                                    ></ItemCheckbox>))}
                            </Box>
                        ),
                    },
                    {
                        heading: {
                            id: "patient",
                            icon: "ic-patient",
                            title: "patient",
                        },
                        children: (
                            <FilterRootStyled>
                                <PatientFilter
                                    OnSearch={(data: { query: ActionBarState }) => {
                                        console.log(data)
                                    }}
                                    item={{
                                        heading: {
                                            icon: "ic-patient",
                                            title: "patient",
                                        },
                                        gender: {
                                            heading: "gender",
                                            genders: ["male", "female"],
                                        },
                                        textField: {
                                            labels: [
                                                {label: "name", placeholder: "name"},
                                                {label: "birthdate", placeholder: "--/--/----"},
                                                {label: "phone", placeholder: "phone"},
                                            ],
                                        },
                                    }} t={t}/>
                            </FilterRootStyled>
                        ),
                    }
                ]}
            />}
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
        </BoxStyled>
    )
}

export default Payment
