import React from 'react'
import PaymentDialogStyled from './overrides/paymentDialogStyle';
import { Stack, Grid, Avatar, Typography, useMediaQuery, Theme, Button, Box, Divider, Checkbox, FormControlLabel, FormGroup, Paper, TextField, IconButton } from '@mui/material'
import IconUrl from '@themes/urlIcon';
import { Otable } from '@features/table';
import { DatePicker } from "@features/datepicker";
import { motion, AnimatePresence } from 'framer-motion';
import { DesktopContainer } from '@themes/desktopConainter';
import { PaymentDialogMobileCard } from '@features/card';
import { MobileContainer } from '@themes/mobileContainer';
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
    initial: { opacity: 0, },
    animate: {
        opacity: 1,
        transition: {
            delay: 0.1,
        }
    }
};
function TabPanel(props: TabPanelProps) {
    const { children, index, ...other } = props;

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
function PaymentDialog({ ...props }) {
    const { data: { t, selected } } = props
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const img = null;
    const devise = process.env.devise;
    const [state, setState] = React.useState<any>({
        species: false,
        card: false,
        cheque: false,
        selected: "",
        tab3Data: [
            {
                amount: "",
                carrier: "",
                bank: "",
                check_number: '',
                payment_date: new Date(),
                expiry_date: new Date(),

            }
        ]
    });
    const handleAddStep = () => {
        const step = [...state.tab3Data, {
            amount: "",
            carrier: "",
            bank: "",
            check_number: '',
            payment_date: new Date(),
            expiry_date: new Date(),
        }

        ];
        setState({
            ...state,
            tab3Data: step
        })
    };
    const handleDeleteStep = (props: any) => {
        const filter = state.tab3Data.filter((item: any) => item !== props)
        setState({
            ...state,
            tab3Data: filter
        })
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };
    return (
        <PaymentDialogStyled>
            <Stack spacing={2} direction={{ xs: selected ? 'column' : 'row', md: 'row' }} alignItems='center' justifyContent={selected ? 'space-between' : 'flex-end'}>
                {
                    selected &&
                    <Stack spacing={2} direction="row" alignItems='center'>
                        <Avatar {...(img ? { src: img, alt: 'some-name', sx: { bgcolor: 'transparent' } } : { sx: { bgcolor: (theme: Theme) => theme.palette.primary.main } })} />
                        <Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <IconUrl path="ic-h" />
                                <Typography color="primary">
                                    {selected.name}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <IconUrl path="ic-anniverssaire" />
                                <Typography variant='body2' color="text.secondary" alignItems='center'>
                                    07/05/2016
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                }

                <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} spacing={1}>
                    {
                        selected &&
                        <Button size='small' variant='contained' color="error"
                            {...(isMobile && {
                                fullWidth: true
                            })}
                        >
                            {t("btn_remain")}
                            <Typography fontWeight={700} component='strong' mx={1}>{selected.pending - selected.amount}</Typography>
                            {devise}
                        </Button>
                    }

                    <Button size='small' variant='contained' color="warning"
                        {...(isMobile && {
                            fullWidth: true
                        })}
                    >
                        {t("total")}
                        <Typography fontWeight={700} component='strong' mx={1}>{selected ? selected.pending : 0}</Typography>
                        {devise}
                    </Button>
                </Stack>
            </Stack>
            {
                selected &&
                <Box mt={4}>
                    <DesktopContainer>
                        <Otable
                            headers={headCells}
                            rows={[selected]}
                            from={"payment_dialog"}
                            sx={{ tableLayout: 'fixed' }}
                            t={t}

                        />
                    </DesktopContainer>
                    <MobileContainer>
                        <PaymentDialogMobileCard data={selected} t={t} />
                    </MobileContainer>
                    <Divider sx={{ mt: 4 }} />
                </Box>
            }

            <FormGroup row
                {...(state.selected && {
                    sx: {
                        borderBottom: 1,
                        borderColor: 'divider'
                    }
                })}
            >
                {data.map((method: { icon: string; label: string }) =>
                    <FormControlLabel
                        className={method.label === state.selected ? "selected" : ''}
                        onClick={
                            () => setState({
                                ...state,
                                selected: method.label
                            })
                        }
                        key={method.label}
                        control={
                            <Checkbox checked={state[method.label]} onChange={handleChange} name={method.label} />
                        }
                        label={
                            <Stack className='label-inner' direction='row' alignItems="center" spacing={1}>
                                <IconUrl path={method.icon} />
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
                    state.selected === "species" &&
                    <TabPanel index={0}>
                        <Stack px={{ xs: 2, md: 4 }} minHeight={200} justifyContent="center">
                            <Box width={1}>
                                <Typography gutterBottom>
                                    {t('enter_the_amount')}
                                </Typography>
                                <Stack direction='row' spacing={2} alignItems="center">
                                    <TextField
                                        type='number'
                                        fullWidth

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
                    state.selected === "card" &&
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
                    state.selected === "cheque" &&
                    <TabPanel index={3}>
                        <Stack p={4} minHeight={200} justifyContent="center">
                            <Typography gutterBottom>
                                {t('enter_the_amount')}
                            </Typography>
                            <Stack spacing={1}>
                                {
                                    state.tab3Data.map((step: any, idx: number) =>
                                        <Paper key={idx}>
                                            <Stack spacing={1} alignItems="flex-start">
                                                <Grid container alignItems="center">
                                                    <Grid item xs={12} lg={2}>
                                                        <Typography color="text.secondary" variant='body2' fontWeight={400}>
                                                            {t("amount")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} lg={10}>
                                                        <Stack direction='row' alignItems="center" spacing={1}>
                                                            <TextField
                                                                variant="outlined"
                                                                placeholder={t("amount")}
                                                                value={state.tab3Data[idx].amount}
                                                                onChange={(e) => {
                                                                    let newArr = [...state.tab3Data];
                                                                    newArr[idx].amount = e.target.value;
                                                                    setState({
                                                                        ...state,
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
                                                        <Typography color="text.secondary" variant='body2' fontWeight={400}>
                                                            {t("carrier")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} lg={10}>
                                                        <TextField
                                                            variant="outlined"
                                                            placeholder={t("carrier")}
                                                            value={state.tab3Data[idx].carrier}
                                                            fullWidth
                                                            type="text"
                                                            onChange={(e) => {
                                                                let newArr = [...state.tab3Data];
                                                                newArr[idx].carrier = e.target.value;
                                                                setState({
                                                                    ...state,
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
                                                        <Typography color="text.secondary" variant='body2' fontWeight={400}>
                                                            {t("bank")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} lg={10}>
                                                        <TextField
                                                            variant="outlined"
                                                            placeholder={t("bank")}
                                                            value={state.tab3Data[idx].bank}
                                                            fullWidth
                                                            onChange={(e) => {
                                                                let newArr = [...state.tab3Data];
                                                                newArr[idx].bank = e.target.value;
                                                                setState({
                                                                    ...state,
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
                                                        <Typography color="text.secondary" variant='body2' fontWeight={400}>
                                                            {t("check_number")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} lg={10}>
                                                        <TextField
                                                            variant="outlined"
                                                            placeholder={t("check_number")}
                                                            fullWidth
                                                            value={state.tab3Data[idx].check_number}
                                                            type="number"
                                                            required
                                                            onChange={(e) => {
                                                                let newArr = [...state.tab3Data];
                                                                newArr[idx].check_number = e.target.value;
                                                                setState({
                                                                    ...state,
                                                                    tab3Data: newArr
                                                                })
                                                            }
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container alignItems="center">
                                                    <Grid item xs={12} lg={2}>
                                                        <Typography color="text.secondary" variant='body2' fontWeight={400}>
                                                            {t("payment_date")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} lg={10}>
                                                        <Grid container alignItems='cetner' spacing={1}>
                                                            <Grid item xs={12} lg={4}>
                                                                <DatePicker
                                                                    value={state.tab3Data[idx].payment_date}
                                                                    onChange={(newValue: any) => {
                                                                        let newArr = [...state.tab3Data];
                                                                        newArr[idx].payment_date = newValue;
                                                                        setState({
                                                                            ...state,
                                                                            tab3Data: newArr
                                                                        })
                                                                    }}
                                                                />

                                                            </Grid>
                                                            <Grid item xs={12} lg={8}>
                                                                <Stack direction={{ xs: 'column', lg: 'row' }} alignItems={{ lg: 'center', xs: 'flex-start' }} spacing={{ xs: 0, lg: 4 }}>
                                                                    <Typography color="text.secondary" variant='body2' fontWeight={400}>
                                                                        {t("expiry_date")}
                                                                    </Typography>
                                                                    <DatePicker
                                                                        value={state.tab3Data[idx].expiry_date}
                                                                        onChange={(newValue: any) => {
                                                                            let newArr = [...state.tab3Data];
                                                                            newArr[idx].expiry_date = newValue;
                                                                            setState({
                                                                                ...state,
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
                                                    state.tab3Data.length > 1 &&
                                                    <IconButton size="small" onClick={() => handleDeleteStep(step)}>
                                                        <IconUrl path="/setting/icdelete" />
                                                    </IconButton>
                                                }

                                            </Stack>
                                        </Paper>

                                    )
                                }

                            </Stack>
                            <Button onClick={() => handleAddStep()} color="success" variant='contained' sx={{ alignSelf: "flex-end", mt: 2 }}>
                                + {t("add_cheque")}
                            </Button>
                        </Stack>
                    </TabPanel>
                }

            </AnimatePresence >
        </PaymentDialogStyled >
    )
}

export default PaymentDialog