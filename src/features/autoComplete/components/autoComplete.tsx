import React, { useCallback, useState } from "react";
import RootStyled from './overrides/rootStyled';
import Box from "@mui/material/Box";
import MenuList from "@mui/material/MenuList";
import {
    Button,
    Divider,
    IconButton,
    InputAdornment,
    InputBase,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Theme,
    useMediaQuery
} from "@mui/material";
import { PatientAppointmentCard } from "@features/card";
import AddIcon from '@mui/icons-material/Add';
import { debounce } from "lodash";
import { onResetPatient } from "@features/tabPanel";
import { useAppDispatch } from "@lib/redux/hooks";
import IconUrl from "@themes/urlIcon";

function AutoComplete({ ...props }) {
    const { data, defaultValue, loading, onSelectData, onSearchChange, t, onAddPatient, size } = props;

    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const [focus, setFocus] = useState(false);

    const onChangeInput = useCallback((value: string) => {
        onSearchChange(value);
    }, [onSearchChange]);

    const handleOnAddPatient = useCallback(() => {
        onAddPatient();
    }, [onAddPatient]);

    const handleListItemClick = ({ ...props }) => {
        onSelectData(props);
    };

    const onKeyDown = (e: any) => {
        if (e.keyCode === 38 || e.keyCode === 40) {
            setFocus(false);
        }
    };

    const debouncedOnChange = debounce(onChangeInput, 1000);

    return (
        <RootStyled>
            <Stack direction="row" alignItems="center" spacing={1}>
                <TextField
                    fullWidth
                    key={`${defaultValue}-input`}
                    {...{ defaultValue }}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={t("stepper-2.search_placeholder")}
                    autoFocus
                    onKeyDown={onKeyDown}
                    onChange={event => {
                        event.stopPropagation();
                        debouncedOnChange(event.target.value);
                        if (event.target.value !== '') {
                            setFocus(true);
                        } else {
                            setFocus(false);
                        }
                    }}
                    inputProps={{ 'aria-label': 'Chercher un patient' }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <IconUrl path="ic-outline-search-normal" />
                        </InputAdornment>,
                    }}
                />
                {isMobile || size === "small" ?
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                            dispatch(onResetPatient());
                            handleOnAddPatient()
                        }}>
                        <AddIcon />
                    </IconButton>
                    :
                    <Button
                        className="btn-add-patient"
                        onClick={() => {
                            dispatch(onResetPatient());
                            handleOnAddPatient()
                        }}
                        size={"small"}
                        color="primary"
                        aria-label="directions">
                        <AddIcon />
                        {t('stepper-2.add_button')}
                    </Button>}
            </Stack>
            {
                focus && <Box className="scroll-main">
                    <MenuList
                        id={"item-list"}
                        autoFocusItem={!focus}>
                        {loading && <LinearProgress color="warning" />}
                        {data?.map((item: any) => (
                            <PatientAppointmentCard
                                {...{ handleListItemClick, item }}
                                key={item.uuid} />
                        ))}
                    </MenuList>
                </Box>
            }

        </RootStyled>
    );
}

export default AutoComplete;
