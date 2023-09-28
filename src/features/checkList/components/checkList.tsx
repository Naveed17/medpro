import {
    Box,
    Checkbox,
    InputAdornment,
    Skeleton,
    TextField,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import React, {ChangeEvent, useEffect, useState} from "react";
import ItemCheckbox from "@themes/overrides/itemCheckbox";
import {useAppDispatch} from "@lib/redux/hooks";
import {SetAssurance, SetLangues, SetMode} from "@features/checkList";

function CheckList({...props}) {
    const dispatch = useAppDispatch();

    const [value, setValue] = useState("");

    const [state, setstate] = useState(props.data.data);

    const initalData = Array.from(new Array(20));

    const handleChange = (
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setValue(e.target.value);
    };

    const handleChangeCheck = (checked: any, item: any) => {
        const index = state.findIndex((v: any) => v.uuid === item.uuid);
        if (checked) {
            index == -1 && setstate([...state, item])
        } else {
            const updatedState = [...state];
            updatedState.splice(index, 1);
            console.log("updatedState", updatedState);
            setstate(updatedState);
        }
    };

    useEffect(() => {
        switch (props.action) {
            case "assurance":
                dispatch(SetAssurance(state));
                break;
            case "mode":
                dispatch(SetMode(state));
                break;
            case "langues":
                dispatch(SetLangues(state));
                break;
            default:
                break;
        }
    }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

    console.log("state", state);
    return (
        <>
            {props.search !== "" && (
                <TextField
                    id="standard-basic"
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
                    }}
                />
            )}

            {props.loading
                ? initalData.map((item, index) => (
                    <Box
                        key={index}
                        sx={{display: "flex", alignItems: "center", margin: "0 5px"}}
                    >
                        <Checkbox size="small"/>
                        <Skeleton width={180} variant="text"/>
                    </Box>
                ))
                : props.items
                    .filter((item: any) => {
                        return item.name.toLowerCase().includes(value.toLowerCase());
                    })
                    .map((item: any, index: number) => (
                        <ItemCheckbox
                            key={index}
                            data={item}
                            checked={
                                props.data?.data.find(
                                    (i: { uuid: string }) => i.uuid == item.uuid
                                ) !== undefined
                            }
                            onChange={(v: any) => handleChangeCheck(v, item)}
                        ></ItemCheckbox>
                    ))}
        </>
    );
}

export default CheckList;
