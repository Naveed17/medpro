import {useEffect, useState} from "react";
import RootStyled from './overrides/rootStyled';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuList from "@mui/material/MenuList";
import {InputAdornment} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import {PatientAppointmentCard} from "@features/card";

function AutoComplete({...props}) {
    const {data: initData, onSelectData} = props;
    const [focus, setFocus] = useState(true);
    const [data, setData] = useState(initData);

    const handleListItemClick = ({...props}) => {
        onSelectData(props);
    };

    const onKeyDown = (e: any) => {
        if (e.keyCode === 38 || e.keyCode === 40) {
            setFocus(false);
        }
    };

    const handleChange = (e: any) => {
        const filtered = initData?.filter((item: any) =>
            item.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.contact[0]?.value.toLowerCase().includes(e.target.value.toLowerCase()));
        setData(filtered);
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
                    id={"item-list"}
                    autoFocusItem={!focus}
                >
                    {data?.map((item: any, index: number) => (
                        <PatientAppointmentCard
                            key={item.uuid}
                            item={item}
                            onClick={() => handleListItemClick(item)}/>
                    ))}
                </MenuList>

            </Box>
        </RootStyled>
    );
}

export default AutoComplete;
