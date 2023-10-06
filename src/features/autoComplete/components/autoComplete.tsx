import React, {useCallback, useState} from "react";
import RootStyled from './overrides/rootStyled';
import Box from "@mui/material/Box";
import MenuList from "@mui/material/MenuList";
import {Button, Divider, IconButton, InputBase, LinearProgress, Paper, Theme, useMediaQuery} from "@mui/material";
import {PatientAppointmentCard} from "@features/card";
import AddIcon from '@mui/icons-material/Add';
import {debounce} from "lodash";
import {onResetPatient} from "@features/tabPanel";
import {useAppDispatch} from "@lib/redux/hooks";

function AutoComplete({...props}) {
    const {data, loading, onSelectData, onSearchChange, t, onAddPatient} = props;

    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const [focus, setFocus] = useState(true);

    const onChangeInput = useCallback((value: string) => {
        onSearchChange(value);
    }, [onSearchChange]);

    const handleOnAddPatient = useCallback((event: any) => {
        dispatch(onResetPatient());
        onAddPatient(event);
    }, [dispatch, onAddPatient]);

    const handleListItemClick = ({...props}) => {
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
            <Paper
                component="form"
                sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: 400}}>
                <InputBase
                    sx={{ml: 1, flex: 1}}
                    placeholder={t("stepper-2.search_placeholder")}
                    autoFocus
                    onFocus={() => setFocus(true)}
                    onKeyDown={onKeyDown}
                    onChange={event => {
                        event.stopPropagation();
                        debouncedOnChange(event.target.value);
                    }}
                    inputProps={{'aria-label': 'Chercher un patient'}}
                />
                <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>
                {isMobile ?
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={handleOnAddPatient}>
                        <AddIcon/>
                    </IconButton>
                    :
                    <Button
                        onClick={handleOnAddPatient}
                        size={"small"}
                        color="primary"
                        sx={{m: .5}} aria-label="directions">
                        <AddIcon/>
                        {t('stepper-2.add_button')}
                    </Button>}
            </Paper>
            <Box className="scroll-main">
                <MenuList
                    id={"item-list"}
                    autoFocusItem={!focus}>
                    {loading && <LinearProgress color="warning"/>}
                    {data?.map((item: any) => (
                        <PatientAppointmentCard
                            {...{handleListItemClick, item}}
                            key={item.uuid}/>
                    ))}
                </MenuList>
            </Box>
        </RootStyled>
    );
}

export default AutoComplete;
