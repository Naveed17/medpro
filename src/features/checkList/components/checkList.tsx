import {InputAdornment, TextField} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { ChangeEvent, useState} from "react";
import ItemCheckbox from "@themes/overrides/itemCheckbox";


function checkList({...props}) {

    const [value, setValue] = useState('');
    const [state, setstate] = useState({});
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.target.value);
    }
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
                        }}/>}

            {
                props.items.filter(
                    (item: any) => {
                        return item.name.toLowerCase().includes(value.toLowerCase());
                    }
                ).map((item: any, index: number) => (
                    <ItemCheckbox key={index}
                                  data={item}
                                  onChange={(v: any) => setstate({...state, [item.name]: v})}></ItemCheckbox>
                ))}

        </>
    )
}
export default checkList;