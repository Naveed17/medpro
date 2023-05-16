import React, {useState} from "react";
import {Box, Popover, FormControl, TextField, Button, Stack} from "@mui/material";
import {useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector} from "@features/leftActionBar";
import {DateRange} from 'react-date-range';
import moment from "moment-timezone";

function DateRangeFilter({...props}) {
    const {t, OnSearch} = props;

    const {query: filterData} = useAppSelector(leftActionBarSelector);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [queryState, setQueryState] = useState<any>({
        dates: [{
            startDate: filterData?.payment?.dates ? filterData.payment.dates[0].startDate : new Date(),
            endDate: filterData?.payment?.dates ? filterData.payment.dates[0].endDate : null,
            key: 'selection'
        }]
    });

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDateRangeChange = (dates: any) => {
        const dateRangeState = {
            ...queryState,
            dates
        };
        setQueryState(dateRangeState);
        if (dates) {
            OnSearch({
                query: dateRangeState
            });
        } else {
            OnSearch({
                query: {
                    ...queryState,
                    dates: null
                }
            });
        }
    }

    const resetDateRange = () => {
        setQueryState({
            dates: [{
                startDate: new Date(),
                endDate: null,
                key: 'selection'
            }]
        });

        OnSearch({
            query: {
                ...queryState,
                dates: null
            }
        });
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box>
            <FormControl fullWidth aria-describedby={id}>
                <TextField
                    sx={{
                        "& .MuiInputBase-input": {
                            textAlign: "center"
                        }
                    }}
                    value={`${queryState.dates[0]?.startDate ? moment(queryState.dates[0].startDate).format('DD/MM/YYYY') : ""} — ${queryState.dates[0]?.endDate ? moment(queryState.dates[0].endDate).format('DD/MM/YYYY') : ""}`}
                    onClick={handleClick}
                />
            </FormControl>
            <Button
                sx={{mt: 1}}
                size={"small"}
                variant={"text"}
                onClick={() => resetDateRange()}>Réinitialiser le filtre de période</Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <DateRange
                    onChange={item => handleDateRangeChange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={queryState.dates as any}
                />
                <Stack direction={"row"} mb={1} mr={1} spacing={1.2} justifyContent={"flex-end"}>
                    <Button
                        size={"small"}
                        color={"primary"}
                        variant={"text"}
                        onClick={() => handleClose()}>Confirmer</Button>
                    <Button
                        size={"small"}
                        color={"error"}
                        variant={"text"}
                        onClick={() => {
                            resetDateRange();
                            handleClose();
                        }}>Annuler</Button>
                </Stack>

            </Popover>
        </Box>)
}

export default DateRangeFilter;
