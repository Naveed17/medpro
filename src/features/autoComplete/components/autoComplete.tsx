import {MouseEventHandler, useState} from "react";
import RootStyled from './overrides/rootStyled';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuList from "@mui/material/MenuList";
import {InputAdornment} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import PatientAppointmentCard from "../../card/components/patientAppointmentCard/patientAppointmentCard";

function AutoComplete({...props}) {
    const {data, getData} = props;
    const [focus, setFocus] = useState(true);
    const [value, setValue] = useState('');
    const handleListItemClick = ({...props}) => {
        getData(props);
    };

    const onKeyDown = (e: any) => {
        if (e.keyCode === 38 || e.keyCode === 40) {
            setFocus(false);
        }
    };
    const handleChange = (e: any) => {
        setValue(e.target.value);
    }
    return (
        <RootStyled>
            <TextField
                id="standard-basic"
                variant="outlined"
                placeholder="Chercher un patient"
                autoFocus
                onFocus={() => setFocus(true)}
                onKeyDown={onKeyDown}
                onChange={(e) => {
                    handleChange(e);
                }}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" sx={{justifyContent: "center"}}>
                            <CodeIcon
                                sx={{
                                    transform: "rotate(90deg)",
                                    color: "text.secondary",
                                    fontSize: "1rem",
                                }}
                            />
                        </InputAdornment>
                    ),
                }}
            />
            <Box className="scroll-main">
                <MenuList
                    autoFocusItem={!focus}
                >
                    {value !== '' ? data.filter((item: any) => item.name.toLowerCase().includes(value.toLowerCase())).map((item: any) => (
                            <PatientAppointmentCard key={item.id} item={item} onClick={() => handleListItemClick(item)}/>
                        ))
                        : data.map((item: any, index: number) => (
                            <PatientAppointmentCard key={item.id} item={item}
                                                    onClick={() => handleListItemClick(item)}/>
                        ))}
                </MenuList>

            </Box>

        </RootStyled>
    );
}

export default AutoComplete;
