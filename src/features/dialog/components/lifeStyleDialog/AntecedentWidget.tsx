import React, {memo, useState} from "react";
import dynamic from "next/dynamic";
import {Button} from "@mui/material";

const FormBuilder: any = dynamic(
    () => import("@formio/react").then((mod: any) => mod.Form),
    {
        ssr: false,
    }
);
const AntecedentWidget: any = memo(
    ({src, ...props}: any) => {
        const {state, list,setState} = props;
        const [value, setValue] = useState(list);
        const getData = () => {
            const res = state.find((i: AntecedentsModel) => i.uuid === value.uuid)
             return res ? res.response : "";
        }
        return (
            <>
            <FormBuilder
                onChange={(ev: any) => {
                    let items = state.map((item: AntecedentsModel) => ({...item}));
                    let item = items.find((i: AntecedentsModel) => i.uuid === value.uuid)
                    if (item) item.response = JSON.stringify(ev.data);
                    console.log(items)
                    setState(items)
                }}
                submission={{
                    data: getData()
                }}
                form={{
                    display: "form",
                    components: value.values,
                }}
            />
            <Button onClick={()=>{
                value.values.push({input:true, key: "grossesse2", label: "grossesse1", tableView:true, type: "textfield"})
                setValue({...value})
            }}>add</Button>
                </>
        );
    },
    // NEVER UPDATE
    () => true
);
AntecedentWidget.displayName = "antecedent-form";

export default AntecedentWidget
