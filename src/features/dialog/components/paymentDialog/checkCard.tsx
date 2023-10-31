import {
    Card,
    CardContent,
    Collapse,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
    Theme,
    Typography,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import React, {useState} from "react";
import CheckBoxIcon from "@mui/icons-material/Check";
import useBanks from "@lib/hooks/rest/useBanks";
import {DatePicker} from "@features/datepicker";
import moment from "moment-timezone";

function CheckCard({...props}) {
    const {t, devise, item, wallet, paymentTypesList, updatePaymentMeans,setPayments,payments,i} = props;
    const [expand, setExpand] = useState(true);
    return (
        <Stack className="check-container">
            <Collapse in={expand}>
                <Stack spacing={2}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        width={{xs: 1, sm: "100%"}}
                    >
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
                                                    bgcolor: (theme: Theme) => theme.palette.primary.main,
                                                    color: (theme: Theme) => theme.palette.common.white,
                                                    img: {
                                                        filter: "brightness(0) invert(1)",
                                                    },
                                                    ".MuiTypography-root": {
                                                        color: (theme: Theme) => theme.palette.common.white,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                }}
                                onChange={(e) => {
                                }
                                }
                                renderValue={(selected) => {
                                    const payment = paymentTypesList?.find(
                                        (payment: any) => payment?.slug === selected
                                    );
                                    if (selected === "wallet") {
                                        return (
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    style={{width: 16}}
                                                    src={"/static/icons/ic-wallet-money.svg"}
                                                    alt={"payment means"}
                                                />
                                            </Stack>
                                        );
                                    }

                                    return (
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                style={{width: 16}}
                                                src={payment?.logoUrl?.url}
                                                alt={"payment means"}
                                            />
                                        </Stack>
                                    );
                                }}
                            >
                                {paymentTypesList?.map((payment: any) => (
                                    <MenuItem value={payment.slug}
                                              onClick={() => updatePaymentMeans(payment.slug)}
                                              key={payment.uuid}>
                                        <Stack direction="row" alignItems="center"
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
                                {wallet > 0 ? (
                                    <MenuItem value={"wallet"}>
                                        <Stack direction="row"
                                               alignItems="center"
                                               onClick={() => updatePaymentMeans("wallet")}
                                               spacing={1}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                style={{width: 16}}
                                                src={"/static/icons/ic-wallet-money.svg"}
                                                alt={"payment means"}
                                            />
                                            <Typography>{t("wallet")}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {wallet} {devise}
                                            </Typography>
                                        </Stack>
                                    </MenuItem>
                                ) : null}
                            </Select>
                        </FormControl>
                        <TextField
                            sx={{
                                input: {
                                    fontWeight: 700,
                                },
                            }}
                            onChange={(e) => {
                                payments[i].amount = e.target.value
                                setPayments([...payments])
                            }}
                            variant="outlined"
                            placeholder={t("amount")}
                            value={item.amount}
                            fullWidth
                            type="number"
                            required
                        />
                        <Typography>{devise}</Typography>
                        <IconButton
                            className="btn-check-success"
                            onClick={() => setExpand(false)}
                        >
                            <CheckBoxIcon/>
                        </IconButton>
                    </Stack>

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
                                value={'carrier'}
                                required
                            />
                        </Stack>
                        <Stack spacing={0.5} width={1}>
                            <Typography variant="body2" color="text.secondary">
                                {t("bank")}
                            </Typography>
                            {/*              <Autocomplete
                id={"banks"}
                freeSolo
                fullWidth
                autoHighlight
                disableClearable
                placeholder={t("bank")}
                size="small"
                value={""}
                onChange={(e, newValue: any) => {
                  e.stopPropagation();

                }}
                filterOptions={(options, params) =>
                  filterReasonOptions(options, params, t)
                }
                sx={{ color: "text.secondary" }}
                options={banks ? banks : []}
                loading={banks?.length === 0}
                getOptionLabel={(option) => {
                  return option.name;
                }}
                isOptionEqualToValue={(option: any, value) =>
                  option.name === value?.name
                }
                renderOption={(props, option) => (
                  <Stack key={option.uuid ? option.uuid : "-1"}>
                    {!option.uuid && <Divider />}
                    <MenuItem {...props} value={option.uuid}>
                      {!option.uuid && <AddOutlinedIcon />}
                      {option.name}
                    </MenuItem>
                  </Stack>
                )}
                renderInput={(params) => (
                  <TextField
                    color={"info"}
                    {...params}
                    placeholder={"--"}
                    sx={{ paddingLeft: 0 }}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />*/}
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
                                value={'check_number'}
                                required
                            />
                        </Stack>
                        <Stack spacing={0.5} width={1}>
                            <Typography variant="body2" color="text.secondary">
                                {t("payment_date")}
                            </Typography>
                            <DatePicker
                                value={item.data?.payment_date}
                                onChange={(newValue: any) => {
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </Collapse>
            <Collapse in={!expand}>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Stack
                                direction={{xs: "column", sm: "row"}}
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={{xs: 1, sm: 0}}
                            >
                                <Typography
                                    display="inline-flex"
                                    alignItems="center"
                                    variant="subtitle2"
                                    textAlign="center"
                                >
                                    #{1}
                                    <Typography variant="body1" ml={{xs: 1, md: 2}}>
                                        {t("check_title")}
                                    </Typography>
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <IconButton
                                        size="small"
                                        className="btn-action"
                                        onClick={() => setExpand(true)}
                                    >
                                        <IconUrl path="ic-edit"/>
                                    </IconButton>

                                    <IconButton
                                        size="small"
                                        className="btn-action"
                                        onClick={() => {

                                        }
                                        }
                                    >
                                        <IconUrl path="setting/icdelete"/>
                                    </IconButton>
                                </Stack>
                            </Stack>
                            <table>
                                <tbody>
                                <tr>
                                    <td align="left">
                                        {moment().format(
                                            "DD-MM-YYYY"
                                        )}
                                    </td>
                                    <td className="bank-data" align="center">
                                        {item.data ? item.data.bank : "--"}
                                    </td>
                                    <td align="center">
                                        {item.data ? item.data.carrier : "--"}
                                    </td>
                                    <td align="center">
                                        {item.data ? "N° " + item.data.check_number : "--"}
                                    </td>
                                    <td align="right">
                                        {item.data ? item.data.amount + " DT" : "--"}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Stack>
                    </CardContent>
                </Card>
            </Collapse>
        </Stack>
    );
}

export default CheckCard;
