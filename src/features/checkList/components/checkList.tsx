import {Box, Checkbox, InputAdornment, Skeleton, Stack, TextField, Typography} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import React, {ChangeEvent, useEffect, useState} from "react";
import ItemCheckbox from "@themes/overrides/itemCheckbox";
import {useAppDispatch} from "@app/redux/hooks";
import {SetAssurance, SetLangues, SetMode, SetQualifications} from "@features/checkList";


function CheckList({...props}) {

    const dispatch = useAppDispatch();

    const [value, setValue] = useState('');

    const [state, setstate] = useState(props.data.data);

    const initalData = Array.from(new Array(20));

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const handleChangeCheck = (v: any, item: any) => {
        const index = state.findIndex((v: any) => v.id === item.id)
        v ? setstate([...state, item]) : setstate([...state.slice(0, index), ...state.slice(index + 1, state.length)]);
    }

    useEffect(() => {
        switch (props.action) {
            case 'assurance':
                dispatch(SetAssurance(state));
                break;
            case 'mode':
                dispatch(SetMode(state))
                break;
            case 'langues':
                dispatch(SetLangues(state))
                break;
            default:
                break;
        }
    }, [state])

    return (
        <>
            {props.search !== '' && <TextField id="standard-basic"
                                               variant="outlined"
                                               sx={{marginBottom: 3}}
                                               placeholder={props.search}
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
                                               }}/>
            }

            {
                props.loading ?
                    initalData.map((item, index) => (
                        <Box key={index} sx={{display: 'flex', alignItems: 'center', margin: '0 5px'}}>
                            <Checkbox size="small"/>
                            <Skeleton width={180} variant="text"/>
                        </Box>
                    )) :

                    props.items.filter(
                        (item: any) => {
                            return item.name.toLowerCase().includes(value.toLowerCase());
                        }
                    ).map((item: any, index: number) => (
                        <ItemCheckbox key={index}
                                      data={item}
                                      checked={props.data?.data.find((i: { id: any; }) => i.id == item.id) !== undefined}
                                      onChange={(v: any) => handleChangeCheck(v, item)}></ItemCheckbox>
                    ))
            }

        </>
    )
}

export default CheckList;