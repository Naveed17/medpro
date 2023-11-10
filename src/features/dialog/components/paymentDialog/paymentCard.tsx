import React, {useState} from "react";
import {
    Autocomplete,
    Card,
    CardContent,
    Collapse,
    Divider,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
    Theme,
    Typography,
    useTheme,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {motion} from "framer-motion";
import moment from "moment-timezone";
import {DatePicker} from "@features/datepicker";
import {filterReasonOptions} from "@lib/hooks";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import useBanks from "@lib/hooks/rest/useBanks";

function PaymentCard({...props}) {
    const {
        t,
        paymentTypesList,
        item,
        i,
        devise,
        payments,
        setPayments,
        selectedPayment,
        setSelectedPayment,
    } = props;
    const theme: Theme = useTheme();

    const {banks} = useBanks();

    const updatePaymentMeans = (slug: string) => {
        payments[i].selected = slug
        if (slug === 'check')
            payments[i] = {
                ...payments[i],
                selected: slug,
                data: {bank: null, carrier: '', nb: '', date: new Date()}
            }
        setPayments([...payments])
    }

    return (
        <Card className={"payment-card"} style={{borderColor:selectedPayment === i ?theme.palette.primary.main:''}}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack
                        component={motion.div}
                        animate={{opacity: 1}}
                        initial={{opacity: 0}}
                        transition={{duration: 0.5}}>
                        <Collapse in={true} timeout="auto" unmountOnExit>
                            <Stack spacing={1}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <FormControl
                                        size="small"
                                        sx={{
                                            minWidth: 60,
                                            ".MuiInputBase-root": {
                                                bgcolor: (theme: Theme) =>
                                                    theme.palette.primary.main + "!important",
                                                svg: {
                                                    path: {
                                                        fill: (theme: Theme) => theme.palette.common.white,
                                                    },
                                                },
                                                img: {
                                                    filter: "brightness(0) invert(1)",
                                                },
                                                "&:focus": {
                                                    bgcolor: "primary.main",
                                                },
                                            },
                                        }}
                                    >
                                        <Select
                                            labelId="select-type"
                                            id="select-type"
                                            value={item.selected}
                                            displayEmpty
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: (theme: Theme) => theme.palette.back.main,
                                                        p: 1,
                                                        ".MuiMenuItem-root": {
                                                            "&:not(:last-child)": {
                                                                mb: 1,
                                                            },
                                                            borderRadius: 1,
                                                            border: 1,
                                                            borderColor: "divider",
                                                            "&:hover": {
                                                                bgcolor: (theme: Theme) =>
                                                                    theme.palette.primary.main,
                                                                color: (theme: Theme) =>
                                                                    theme.palette.common.white,
                                                                img: {
                                                                    filter: "brightness(0) invert(1)",
                                                                },
                                                                ".MuiTypography-root": {
                                                                    color: theme.palette.common.white,
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            }}
                                            renderValue={(selected) => {
                                                const payment = paymentTypesList?.find(
                                                    (payment: any) => payment?.slug === selected
                                                );

                                                return (
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            style={{width: 16}}
                                                            src={payment?.logoUrl?.url}
                                                            alt={"payment means"}/>
                                                    </Stack>
                                                );
                                            }}
                                        >
                                            {paymentTypesList?.map((payment: any) => (
                                                <MenuItem value={payment.slug} key={payment.uuid}>
                                                    <Stack direction="row"
                                                           alignItems="center"
                                                           onClick={() => {
                                                               updatePaymentMeans(payment.slug)
                                                           }}
                                                           spacing={1}>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            style={{width: 16}}
                                                            src={payment?.logoUrl?.url}
                                                            alt={"payment means"}
                                                        />
                                                        <Typography>{t(payment?.name)}</Typography>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        sx={{
                                            input: {
                                                fontWeight: 700,
                                            },
                                        }}
                                        size="small"
                                        fullWidth
                                        autoFocus={true}
                                        onFocus={()=> setSelectedPayment(i)}
                                        value={item.amount}
                                        onChange={(e) => {
                                            payments[i].amount = e.target.value ? parseInt(e.target.value, 10) : ''
                                            setPayments([...payments])
                                        }
                                        }
                                        type="number"
                                        InputProps={{
                                            inputProps: {
                                                min: 0,
                                            },
                                        }}
                                    />
                                    <Typography>{devise}</Typography>
                                    {i > 0 && (
                                        <IconButton
                                            className="btn-del"
                                            onClick={() => {
                                                payments.splice(i, 1)
                                                setPayments([...payments])
                                            }}
                                        >
                                            <IconUrl path={"setting/icdelete"}/>
                                        </IconButton>
                                    )}
                                </Stack>
                                {!item.amount && <Typography color={theme.palette.error.main}
                                                             fontSize={12}>{t('dialog.error')}</Typography>}

                                {item.selected === 'check' && <Stack>
                                    <Stack
                                        direction={{xs: "column", sm: "row"}}
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Stack spacing={0.5} width={1}>
                                            <Typography variant="body2" color="text.secondary">
                                                {t("carrier")}
                                            </Typography>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t("carrier")}
                                                fullWidth
                                                type="text"
                                                onChange={(e) => {
                                                    payments[i].data.carrier = e.target.value
                                                    setPayments([...payments])
                                                }}
                                                value={item.data.carrier}
                                                required
                                            />
                                        </Stack>
                                        <Stack spacing={0.5} width={1}>
                                            <Typography variant="body2" color="text.secondary">
                                                {t("bank")}
                                            </Typography>


                                            <Autocomplete
                                                id={"banks"}
                                                freeSolo
                                                fullWidth
                                                autoHighlight
                                                disableClearable
                                                placeholder={t("bank")}
                                                size="small"
                                                value={item.data.bank}
                                                onChange={(e, newValue: any) => {
                                                    e.stopPropagation();
                                                    payments[i].data.bank = newValue;
                                                    setPayments([...payments])
                                                }}
                                                filterOptions={(options, params) => filterReasonOptions(options, params, t)}
                                                sx={{color: "text.secondary"}}
                                                options={banks ? banks : []}
                                                loading={banks?.length === 0}
                                                getOptionLabel={(option) => {
                                                    return option.name || "";
                                                }}
                                                isOptionEqualToValue={(option: any, value) => option.uuid === value?.uuid}
                                                renderOption={(props, option) => (
                                                    <Stack
                                                        key={option.uuid ? option.uuid : "-1"}>
                                                        {!option.uuid && <Divider/>}
                                                        <MenuItem
                                                            {...props}
                                                            value={option.uuid}>
                                                            {!option.uuid && <AddOutlinedIcon/>}
                                                            {option.name}
                                                        </MenuItem>
                                                    </Stack>
                                                )}
                                                renderInput={params => <TextField color={"info"}
                                                                                  {...params}
                                                                                  placeholder={"--"}
                                                                                  sx={{paddingLeft: 0}}
                                                                                  variant="outlined"
                                                                                  fullWidth/>}/>


                                        </Stack>
                                    </Stack>
                                    <Stack
                                        direction={{xs: "column", sm: "row"}}
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Stack spacing={0.5} width={1}>
                                            <Typography variant="body2" color="text.secondary">
                                                {t("check_number")}
                                            </Typography>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t("check_number")}
                                                fullWidth
                                                type="number"
                                                value={item.data.nb}
                                                onChange={(e) => {
                                                    payments[i].data.nb = e.target.value;
                                                    setPayments([...payments])
                                                }}
                                                required
                                            />
                                        </Stack>
                                        <Stack spacing={0.5} width={1}>
                                            <Typography variant="body2" color="text.secondary">
                                                {t("payment_date")}
                                            </Typography>
                                            <DatePicker
                                                value={item.data.date}
                                                onChange={(newValue: any) => {
                                                    payments[i].data.date = newValue
                                                    setPayments([...payments])
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>}
                            </Stack>
                        </Collapse>
                    </Stack>

                </Stack>
            </CardContent>
        </Card>
    )
        ;
}

export default PaymentCard;
