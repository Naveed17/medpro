import {
    Checkbox,
    Chip,
    IconButton,
    InputAdornment,
    ListSubheader,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {motion} from "framer-motion";
import React, {useRef, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import SearchIcon from "@mui/icons-material/Search";

const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
];

function Step2({...props}) {
    const {t, devise, formik} = props;
    const [state, setState] = useState({
        ticket_moderateur: "amount",
        ticket_refund: "amount",
    });
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLDivElement | null>(null);
    const {values, setFieldValue} = formik;
    const handleChange = (event: any) => {
        const {
            target: {value},
        } = event;
        setFieldValue("insurance", {
            ...values.insurance,
            apci: typeof value === "string" ? value.split(",") : value,
        });
    };
    const handleDelete = (props: any) => {
        const name = props;
        const index = values.insurance.apci.indexOf(name);
        if (index >= 0) {
            const newNames = [...values.insurance.apci];
            newNames.splice(index, 1);
            setFieldValue("insurance", {
                ...values.insurance,
                apci: newNames,
            });
        }
    };
    return (
        <Stack
            component={motion.div}
            key="step3"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
            spacing={2}
            pb={3}
        >
            <Stack direction="row" spacing={1} width={1}>
                <Stack spacing={0.5} width={1}>
                    <Typography variant="body2" color="text.secondary">
                        {t("dialog.stepper.ticket_moderateur_amount")}
                    </Typography>
                    <TextField
                        type="number"
                        fullWidth
                        placeholder={t(
                            "dialog.stepper.ticket_moderateur_amount_placeholder"
                        )}
                        value={values.insurance.ticket_moderateur}
                        onChange={(event) => {
                            setFieldValue("insurance", {
                                ...values.insurance,
                                ticket_moderateur: event.target.value,
                            });
                        }}
                    />
                </Stack>
                <Stack
                    direction="row"
                    border={1}
                    borderColor="divider"
                    borderRadius={1}
                    alignSelf="flex-end"
                    bgcolor={(theme) => theme.palette.info.main}
                    p={0.5}
                >
                    <Typography
                        onClick={() => setState({...state, ticket_moderateur: "amount"})}
                        display="flex"
                        variant="body2"
                        sx={{
                            cursor: "pointer",
                            minWidth: 40,
                            transition: "all 0.5s ease-in-out",
                            transform:
                                state.ticket_moderateur === "amount"
                                    ? "translateX(0%)"
                                    : "translateX(100%)",
                        }}
                        alignItems="center"
                        justifyContent="center"
                        p={0.6}
                        {...(state.ticket_moderateur === "amount" && {
                            bgcolor: (theme) => theme.palette.primary.main,
                            color: "common.white",
                            borderRadius: 0.7,
                        })}
                    >
                        {devise}
                    </Typography>
                    <Typography
                        onClick={() => setState({...state, ticket_moderateur: "percent"})}
                        variant="body2"
                        display="flex"
                        sx={{
                            cursor: "pointer",
                            minWidth: 40,
                            transition: "all 0.5s ease-in-out",
                            transform:
                                state.ticket_moderateur === "percent"
                                    ? "translateX(-100%)"
                                    : "translateX(0%)",
                        }}
                        alignItems="center"
                        justifyContent="center"
                        p={0.6}
                        {...(state.ticket_moderateur === "percent" && {
                            bgcolor: (theme) => theme.palette.primary.main,
                            color: "common.white",
                            borderRadius: 0.7,
                        })}
                    >
                        %
                    </Typography>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={1} width={1}>
                <Stack spacing={0.5} width={1}>
                    <Typography variant="body2" color="text.secondary">
                        {t("dialog.stepper.refund_amount")}
                    </Typography>
                    <TextField
                        type="number"
                        fullWidth
                        placeholder={t(
                            "dialog.stepper.ticket_moderateur_amount_placeholder"
                        )}
                        value={values.insurance.ticket_refund}
                        onChange={(event) => {
                            setFieldValue("insurance", {
                                ...values.insurance,
                                ticket_refund: event.target.value,
                            });
                        }}
                    />
                </Stack>
                <Stack
                    direction="row"
                    border={1}
                    borderColor="divider"
                    borderRadius={1}
                    alignSelf="flex-end"
                    bgcolor={(theme) => theme.palette.info.main}
                    p={0.5}
                >
                    <Typography
                        onClick={() => setState({...state, ticket_refund: "amount"})}
                        display="flex"
                        variant="body2"
                        sx={{
                            cursor: "pointer",
                            minWidth: 40,
                            transition: "all 0.5s ease-in-out",
                            transform:
                                state.ticket_refund === "amount"
                                    ? "translateX(0%)"
                                    : "translateX(100%)",
                        }}
                        alignItems="center"
                        justifyContent="center"
                        p={0.6}
                        {...(state.ticket_refund === "amount" && {
                            bgcolor: (theme) => theme.palette.primary.main,
                            color: "common.white",
                            borderRadius: 0.7,
                        })}
                    >
                        {devise}
                    </Typography>
                    <Typography
                        onClick={() => setState({...state, ticket_refund: "percent"})}
                        variant="body2"
                        display="flex"
                        sx={{
                            cursor: "pointer",
                            minWidth: 40,
                            transition: "all 0.5s ease-in-out",
                            transform:
                                state.ticket_refund === "percent"
                                    ? "translateX(-100%)"
                                    : "translateX(0%)",
                        }}
                        alignItems="center"
                        justifyContent="center"
                        p={0.6}
                        {...(state.ticket_refund === "percent" && {
                            bgcolor: (theme) => theme.palette.primary.main,
                            color: "common.white",
                            borderRadius: 0.7,
                        })}
                    >
                        %
                    </Typography>
                </Stack>
            </Stack>
            <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                    APCI
                </Typography>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    onAnimationEnd={() => inputRef?.current?.focus()}
                    multiple
                    open={open}
                    displayEmpty
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    size="small"
                    value={values.insurance.apci || []}
                    onChange={handleChange}
                    MenuProps={{
                        sx: {
                            "& .MuiPaper-root": {
                                minHeight: 300,
                                p: 1,
                                bgcolor: (theme) => theme.palette.back.main,
                                li: {
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    bgcolor: (theme) => theme.palette.common.white,
                                    "&:not(:last-of-type)": {
                                        mb: 0.5,
                                    },
                                    "&.Mui-selected": {
                                        bgcolor: (theme) => theme.palette.primary.main,
                                        color: (theme) => theme.palette.common.white,
                                    },
                                },
                            },
                        },
                        autoFocus: false,
                    }}
                    input={<OutlinedInput id="select-multiple-chip"/>}
                    renderValue={(selected) => {
                        if (!selected || (selected && selected.length === 0)) {
                            return (
                                <Typography color={"gray"}>
                                    {t("dialog.stepper.apci_placeholder")}
                                </Typography>
                            );
                        }
                        return (
                            <Stack flexDirection="row" flexWrap="wrap" sx={{gap: 0.5}}>
                                {selected.map((value: any) => (
                                    <Chip
                                        color="primary"
                                        sx={{height: 25, fontSize: 12}}
                                        onMouseDown={(event) => {
                                            event.stopPropagation();
                                        }}
                                        key={value}
                                        label={value}
                                        onDelete={() => handleDelete(value)}
                                        deleteIcon={
                                            <CloseIcon fontSize="small" sx={{width: 14}}/>
                                        }
                                    />
                                ))}
                            </Stack>
                        );
                    }}
                >
                    <ListSubheader
                        sx={{
                            position: "sticky",
                            top: 5,
                            zIndex: 999,
                            bgcolor: "transparent",
                            cursor: "default",
                            display: "flex",
                            alignItems: "center",
                            py: 1,
                            px: 1,
                        }}
                    >
                        <TextField
                            ref={inputRef}
                            size="small"
                            placeholder={t("search")}
                            autoFocus
                            value={search}
                            onChange={(e) => {
                                e.stopPropagation();
                                setSearch(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                e.stopPropagation();
                            }}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon
                                            sx={{color: (theme) => theme.palette.grey["A200"]}}
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSearch("");
                                            }}
                                        >
                                            <CloseIcon
                                                fontSize="small"
                                                sx={{color: (theme) => theme.palette.grey["A200"]}}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <IconButton
                            size="small"
                            sx={{ml: 1}}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    </ListSubheader>
                    {names
                        .filter((item) => item.toLowerCase().includes(search.toLowerCase()))
                        .map((name) => (
                            <MenuItem key={name} value={name} disableRipple>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <Checkbox
                                        checkedIcon={<IconUrl path="ic-check-white"/>}
                                        checked={
                                            values?.insurance?.apci?.indexOf(name) > -1 ?? false
                                        }
                                    />
                                </Stack>
                                {name}
                            </MenuItem>
                        ))}
                </Select>
            </Stack>
        </Stack>
    );
}

export default Step2;
