import React, {memo, useState} from "react";
import dynamic from "next/dynamic";

const FormBuilder: any = dynamic(
    () => import("@formio/react").then((mod: any) => mod.Form),
    {
        ssr: false,
    }
);
const AntecedentWidget: any = memo(
    ({src, ...props}: any) => {
        const {state,data, list, setState} = props;

        const getData = () => {
            return data.response
        }
        return (
            <>
                <FormBuilder
                    onChange={(ev: any) => {
                        data.response = JSON.stringify(ev.data);
                        setState([...state])
                    }}
                    submission={{
                        data: getData()
                    }}
                    form={{
                        display: "form",
                        components: list.values,
                    }}
                />
                {/*
            <Button onClick={()=>{
                value.values.push({input:true, key: "grossesse2", label: "grossesse1", tableView:true, type: "textfield"})
                setValue({...value})
            }}>add</Button>
*/}
            </>
        );
    },
    // NEVER UPDATE
    () => true
);
AntecedentWidget.displayName = "antecedent-form";

export default AntecedentWidget
