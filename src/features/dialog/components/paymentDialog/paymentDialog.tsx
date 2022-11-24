import React from 'react'
import PaymentDialogStyled from './overrides/paymentDialogStyle';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Paper,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import {Otable} from '@features/table';
import {DatePicker} from "@features/datepicker";
import {AnimatePresence, motion} from 'framer-motion';
import {DesktopContainer} from '@themes/desktopConainter';
import {PaymentDialogMobileCard} from '@features/card';
import {MobileContainer} from '@themes/mobileContainer';
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";

const data = [
    {
        icon: 'ic-argent',
        label: 'species'
    },
    {
        icon: 'ic-card',
        label: 'card'
    },
    {
        icon: 'ic-cheque',
        label: 'cheque'
    },

]

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

const headCells: readonly HeadCell[] = [

    {
        id: "date",
        numeric: false,
        disablePadding: true,
        label: "date",
        sortable: true,
        align: "left",
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "left",
    },
    {
        id: "method",
        numeric: true,
        disablePadding: false,
        label: "method",
        sortable: true,
        align: "right",
    },


];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
}

const variants = {
    initial: {opacity: 0,},
    animate: {
        opacity: 1,
        transition: {
            delay: 0.1,
        }
    }
};

function TabPanel(props: TabPanelProps) {
    const {children, index, ...other} = props;

    return (
        <motion.div
            key={index}
            variants={variants}
            initial="initial"
            animate={"animate"}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className="tab-panel"
            {...other}
        >
            {children}
        </motion.div>
    );
}

function PaymentDialog({...props}) {
    let {data: {patient, selectedPayment, deals, setDeals}} = props
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const devise = process.env.NEXT_PUBLIC_DEVISE;

    const {t, ready} = useTranslation("payment");

    const handleAddStep = () => {
        const step = [...deals.tab3Data, {
            amount: "",
            carrier: "",
            bank: "",
            check_number: '',
            payment_date: new Date(),
            expiry_date: new Date(),
        }];

        setDeals({
            ...deals,
            tab3Data: step
        })
    };

    const handleDeleteStep = (props: any) => {
        const filter = deals.tab3Data.filter((item: any) => item !== props)
        setDeals({
            ...deals,
            tab3Data: filter
        })
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <PaymentDialogStyled>
            <Stack spacing={2}
                   direction={{xs: selectedPayment ? 'column' : 'row', md: 'row'}}
                   alignItems='center'
                   justifyContent={selectedPayment ? 'space-between' : 'flex-end'}>
                {selectedPayment?.patient &&
                    <Stack spacing={2} direction="row" alignItems='center'>
                        <Avatar sx={{width: 24, height: 24}}
                                src={`/static/icons/${patient?.gender !== "O" ? "men" : "women"}-avatar.svg`}/>
                        <Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Typography color="primary">
                                    {selectedPayment?.patient.firstName} {selectedPayment?.patient.lastName}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <IconUrl path="ic-anniverssaire"/>
                                <Typography variant='body2' color="text.secondary" alignItems='center'>
                                    {selectedPayment?.patient.birthdate}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                }

                <Stack
                    direction={{xs: 'column', md: 'row'}}
                    alignItems="center"
                    justifyContent={{xs: 'center', md: 'flex-start'}}
                    sx={{
                        "& .MuiButtonBase-root": {
                            fontWeight: "bold",
                            fontSize: 16
                        }
                    }}
                    spacing={1}>
                    {selectedPayment &&
                        <Button size='small' variant='contained' color="error"
                                {...(isMobile && {
                                    fullWidth: true
                                })}
                        >
                            {t("btn_remain")}
                            <Typography fontWeight={700} component='strong'
                                        mx={1}>{selectedPayment.pending - selectedPayment.amount}</Typography>
                            {devise}
                        </Button>
                    }

                    <Button size='small' variant='contained' color="warning"
                            {...(isMobile && {
                                fullWidth: true
                            })}
                    >
                        {t("total")}
                        <Typography fontWeight={700} component='strong'
                                    mx={1}>{selectedPayment ? selectedPayment.pending : 0}</Typography>
                        {devise}
                    </Button>
                </Stack>
            </Stack>
            {/*            {
                selectedPayment &&
                <Box mt={4}>
                    <DesktopContainer>
                        <Otable
                            headers={headCells}
                            rows={[selectedPayment]}
                            from={"payment_dialog"}
                            sx={{tableLayout: 'fixed'}}
                            t={t}

                        />
                    </DesktopContainer>
                    <MobileContainer>
                        <PaymentDialogMobileCard data={selectedPayment} t={t}/>
                    </MobileContainer>
                </Box>
            }*/}

            <FormGroup
                row
                {...(deals.selected && {
                    sx: {
                        borderBottom: 1,
                        borderColor: 'divider'
                    }
                })}>
                {data.map((method: { icon: string; label: string }) =>
                    <FormControlLabel
                        className={method.label === deals.selected ? "selected" : ''}
                        onClick={() => {
                            setDeals({
                                ...deals,
                                selected: method.label
                            })
                        }}
                        key={method.label}
                        control={
                            <Checkbox checked={deals.selected === method.label} name={method.label}/>
                        }
                        label={
                            <Stack className='label-inner' direction='row' alignItems="center" spacing={1}>
                                <IconUrl path={method.icon}/>
                                {
                                    !isMobile && <Typography>{t(method.label)}</Typography>
                                }

                            </Stack>
                        }
                    />
                )

                }

            </FormGroup>
            <AnimatePresence exitBeforeEnter>
                {
                    deals.selected === "species" &&
                    <TabPanel index={0}>
                        <Stack px={{xs: 2, md: 4}} minHeight={200} justifyContent="center">
                            <Box width={1}>
                                <Typography gutterBottom>
                                    {t('enter_the_amount')}
                                </Typography>
                                <Stack direction='row' spacing={2} alignItems="center">
                                    <TextField
                                        type='number'
                                        fullWidth
                                        value={deals.tab3Data[0].amount}
                                        onChange={(e) => {
                                            let newArr = [...deals.tab3Data];
                                            newArr[0].amount = e.target.value;
                                            setDeals({
                                                ...deals,
                                                tab3Data: newArr
                                            })
                                        }
                                        }
                                    />
                                    <Typography>
                                        {devise}
                                    </Typography>
                                </Stack>

                            </Box>
                        </Stack>
                    </TabPanel>
                }
                {
                    deals.selected === "card" &&
                    <TabPanel index={1}>
                        <Stack px={4} minHeight={200} justifyContent="center">
                            <Box width={1}>
                                <Typography gutterBottom>
                                    {t('enter_the_amount')}
                                </Typography>
                                <Stack direction='row' spacing={2} alignItems="center">
                                    <TextField
                                        type='number'
                                        fullWidth
                                        value={deals.tab3Data[0].amount}
                                        onChange={(e) => {
                                            let newArr = [...deals.tab3Data];
                                            newArr[0].amount = e.target.value;
                                            setDeals({
                                                ...deals,
                                                tab3Data: newArr
                                            })
                                        }
                                        }
                                    />
                                    <Typography>
                                        {devise}
                                    </Typography>
                                </Stack>

                            </Box>
                        </Stack>
                    </TabPanel>
                }
                {
                    deals.selected === "cheque" &&
                    <TabPanel index={3}>
                        <Stack p={4} minHeight={200} justifyContent="center">
                            <Typography gutterBottom>
                                {t('enter_the_amount')}
                            </Typography>
                            <Stack spacing={1}>
                                {deals.tab3Data.map((step: any, idx: number) =>
                                    <Paper key={idx}>
                                        <Stack spacing={1} alignItems="flex-start">
                                            <Grid container alignItems="center">
                                                <Grid item xs={12} lg={2}>
                                                    <Typography color="text.secondary" variant='body2'
                                                                fontWeight={400}>
                                                        {t("amount")}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} lg={10}>
                                                    <Stack direction='row' alignItems="center" spacing={1}>
                                                        <TextField
                                                            variant="outlined"
                                                            placeholder={t("amount")}
                                                            value={deals.tab3Data[idx].amount}
                                                            onChange={(e) => {
                                                                let newArr = [...deals.tab3Data];
                                                                newArr[idx].amount = e.target.value;
                                                                setDeals({
                                                                    ...deals,
                                                                    tab3Data: newArr
                                                                })
                                                            }
                                                            }
                                                            fullWidth
                                                            type="number"
                                                            required
                                                        />
                                                        <Typography>
                                                            TED
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                            <Grid container alignItems="center">
                                                <Grid item xs={12} lg={2}>
                                                    <Typography color="text.secondary" variant='body2'
                                                                fontWeight={400}>
                                                        {t("carrier")}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} lg={10}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("carrier")}
                                                        value={deals.tab3Data[idx].carrier}
                                                        fullWidth
                                                        type="text"
                                                        onChange={(e) => {
                                                            let newArr = [...deals.tab3Data];
                                                            newArr[idx].carrier = e.target.value;
                                                            setDeals({
                                                                ...deals,
                                                                tab3Data: newArr
                                                            })
                                                        }
                                                        }
                                                        required
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container alignItems="center">
                                                <Grid item xs={12} lg={2}>
                                                    <Typography color="text.secondary" variant='body2'
                                                                fontWeight={400}>
                                                        {t("bank")}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} lg={10}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("bank")}
                                                        value={deals.tab3Data[idx].bank}
                                                        fullWidth
                                                        onChange={(e) => {
                                                            let newArr = [...deals.tab3Data];
                                                            newArr[idx].bank = e.target.value;
                                                            setDeals({
                                                                ...deals,
                                                                tab3Data: newArr
                                                            })
                                                        }
                                                        }
                                                        type="text"
                                                        required
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container alignItems="center">
                                                <Grid item xs={12} lg={2}>
                                                    <Typography color="text.secondary" variant='body2'
                                                                fontWeight={400}>
                                                        {t("check_number")}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} lg={10}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t("check_number")}
                                                        fullWidth
                                                        value={deals.tab3Data[idx].check_number}
                                                        type="number"
                                                        required
                                                        onChange={(e) => {
                                                            let newArr = [...deals.tab3Data];
                                                            newArr[idx].check_number = e.target.value;
                                                            setDeals({
                                                                ...deals,
                                                                tab3Data: newArr
                                                            })
                                                        }
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container alignItems="center">
                                                <Grid item xs={12} lg={2}>
                                                    <Typography color="text.secondary" variant='body2'
                                                                fontWeight={400}>
                                                        {t("payment_date")}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} lg={10}>
                                                    <Grid container alignItems='cetner' spacing={1}>
                                                        <Grid item xs={12} lg={4}>
                                                            <DatePicker
                                                                value={deals.tab3Data[idx].payment_date}
                                                                onChange={(newValue: any) => {
                                                                    let newArr = [...deals.tab3Data];
                                                                    newArr[idx].payment_date = newValue;
                                                                    setDeals({
                                                                        ...deals,
                                                                        tab3Data: newArr
                                                                    })
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} lg={8}>
                                                            <Stack direction={{xs: 'column', lg: 'row'}}
                                                                   alignItems={{lg: 'center', xs: 'flex-start'}}
                                                                   spacing={{xs: 0, lg: 4}}>
                                                                <Typography color="text.secondary" variant='body2'
                                                                            fontWeight={400}>
                                                                    {t("expiry_date")}
                                                                </Typography>
                                                                <DatePicker
                                                                    value={deals.tab3Data[idx].expiry_date}
                                                                    onChange={(newValue: any) => {
                                                                        let newArr = [...deals.tab3Data];
                                                                        newArr[idx].expiry_date = newValue;
                                                                        setDeals({
                                                                            ...deals,
                                                                            tab3Data: newArr
                                                                        })
                                                                    }
                                                                    }
                                                                />
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>

                                                </Grid>
                                            </Grid>
                                        </Stack>
                                        <Stack alignItems='flex-end' mt={2}>
                                            {
                                                deals.tab3Data.length > 1 &&
                                                <IconButton size="small" onClick={() => handleDeleteStep(step)}>
                                                    <IconUrl path="/setting/icdelete"/>
                                                </IconButton>
                                            }

                                        </Stack>
                                    </Paper>
                                )}
                            </Stack>
                            <Button onClick={() => handleAddStep()} color="success" variant='contained'
                                    sx={{alignSelf: "flex-end", mt: 2}}>
                                + {t("add_cheque")}
                            </Button>
                        </Stack>
                    </TabPanel>
                }
            </AnimatePresence>
        </PaymentDialogStyled>
    )
}

export default PaymentDialog
