import React, {useState} from "react";
import RootStyled from './overrides/rootStyled';
import Box from "@mui/material/Box";
import MenuList from "@mui/material/MenuList";
import {Button, Divider, InputBase, LinearProgress, Paper} from "@mui/material";
import {PatientAppointmentCard} from "@features/card";
import AddIcon from '@mui/icons-material/Add';

function AutoComplete({...props}) {
    const {data, loading, onSelectData, onSearchChange, t, onAddPatient} = props;
    const [focus, setFocus] = useState(true);

    const handleListItemClick = ({...props}) => {
        onSelectData(props);
    };

    const onKeyDown = (e: any) => {
        if (e.keyCode === 38 || e.keyCode === 40) {
            setFocus(false);
        }
    };

    return (
        <RootStyled>
            <Paper
                component="form"
                sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: 400}}
            >
                <InputBase
                    sx={{ml: 1, flex: 1}}
                    placeholder="Chercher un patient"
                    autoFocus
                    onFocus={() => setFocus(true)}
                    onKeyDown={onKeyDown}
                    onChange={onSearchChange}
                    inputProps={{'aria-label': 'Chercher un patient'}}
                />
                <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>
                <Button
                    onClick={onAddPatient}
                    size={"small"}
                    color="primary"
                    sx={{m: .5}} aria-label="directions">
                    <AddIcon/>
                    {t('stepper-2.add_button')}
                </Button>
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
