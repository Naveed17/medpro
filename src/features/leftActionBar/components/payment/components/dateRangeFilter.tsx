import {Box, FormControl} from "@mui/material";
import {useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector} from "@features/leftActionBar";
import moment from "moment-timezone";
import Datepicker from "react-tailwindcss-datepicker";
import {useState} from "react";

function DateRangeFilter({...props}) {
    const {OnSearch} = props;

    const {query: filterData} = useAppSelector(leftActionBarSelector);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [queryState, setQueryState] = useState<any>({
        dates: [{
            startDate: filterData?.payment?.dates ? filterData.payment.dates[0].startDate : new Date(),
            endDate: filterData?.payment?.dates ? filterData.payment.dates[0].endDate : null,
            key: 'selection'
        }]
    });

    const handleDateRangeChange = (dates: any) => {
        if (dates[0].startDate && dates[0].endDate) {
            const dateRangeState = {...queryState, dates};
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
        } else {
            resetDateRange();
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
                <Datepicker
                    value={{
                        startDate: queryState.dates[0]?.startDate ? moment(queryState.dates[0].startDate) : moment().toDate(),
                        endDate: queryState.dates[0]?.endDate ? moment(queryState.dates[0].endDate) : moment().toDate()
                    } as any}
                    displayFormat={"DD/MM/YYYY"}
                    onChange={item => handleDateRangeChange([item])}
                />
            </FormControl>
        </Box>)
}

export default DateRangeFilter;
