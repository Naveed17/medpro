import React, {useState} from "react";
import {useRouter} from "next/router";
import {Box, Popover, FormControl, Input, TextField, Button, Stack} from "@mui/material";
import _ from "lodash";
import {useAppSelector} from "@app/redux/hooks";
import {leftActionBarSelector} from "@features/leftActionBar";
import {DateRange} from 'react-date-range';
import moment from "moment-timezone";

function DateRangeFilter({...props}) {
    const {t, OnSearch} = props;

    const {query: filterData} = useAppSelector(leftActionBarSelector);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [queryState, setQueryState] = useState<any>({
        dates: null
    });
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDateRangeChange = (dates: any) => {
        setDateRange(dates);
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
            const query = _.omit(queryState, "dates");
            OnSearch({
                ...query
            });
        }
    }

    const resetDateRange = () => {
        setDateRange([{
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }]);

        const query = _.omit(queryState, "dates");
        OnSearch({
            ...query
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
                    value={`${dateRange[0]?.startDate ? moment(dateRange[0].startDate).format('DD/MM/YYYY') : ""} — ${dateRange[0]?.endDate ? moment(dateRange[0].endDate).format('DD/MM/YYYY') : ""}`}
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
                    ranges={dateRange as any}
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
