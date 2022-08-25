import {createSvgIcon} from "@mui/material";
import React from "react";

function SettingsIcon(props: any) {
    const CustomIcon = createSvgIcon(
        <svg viewBox="0 0 22 22">
            <path d="M4.01081 0.550049H2.67677V3.61089C1.45809 3.91095 0.550049 5.00996 0.550049 6.32123C0.550049 7.63251 1.45809 8.73152 2.67677 9.03157V21.45H4.01081V9.03164C5.22955 8.73193 6.13753 7.63285 6.13753 6.32123C6.13753 5.00953 5.22947 3.9109 4.01081 3.61089V0.550049ZM1.88408 6.32123C1.88408 5.51639 2.53895 4.86152 3.34379 4.86152C4.14863 4.86152 4.80349 5.51639 4.80349 6.32123C4.80349 7.12608 4.14863 7.78095 3.34379 7.78095C2.53895 7.78095 1.88408 7.12608 1.88408 6.32123ZM19.3233 0.550049H17.9893V8.28965C16.7706 8.58935 15.8626 9.68843 15.8626 11C15.8626 12.3118 16.7706 13.4104 17.9893 13.7104V21.45H19.3233V13.7105C20.5421 13.4107 21.4501 12.3117 21.4501 11C21.4501 9.68835 20.542 8.58972 19.3233 8.28971V0.550049ZM17.1966 11C17.1966 10.1952 17.8515 9.54034 18.6563 9.54034C19.4611 9.54034 20.116 10.1952 20.116 11C20.116 11.8049 19.4611 12.4598 18.6563 12.4598C17.8515 12.4598 17.1966 11.8049 17.1966 11ZM11.6672 0.550049H10.3332V13.3938C9.11446 13.6935 8.20648 14.7926 8.20648 16.1042C8.20648 17.4159 9.11454 18.5145 10.3332 18.8146V21.45H11.6672V18.8146C12.886 18.5149 13.794 17.4158 13.794 16.1042C13.794 14.7925 12.8859 13.6939 11.6672 13.3939V0.550049ZM9.54051 16.1042C9.54051 15.2994 10.1954 14.6445 11.0002 14.6445C11.8051 14.6445 12.4599 15.2994 12.4599 16.1042C12.4599 16.9091 11.8051 17.5639 11.0002 17.5639C10.1954 17.5639 9.54051 16.9091 9.54051 16.1042Z" fill="#0696D6"/>
        </svg>
        ,
        'Settings')
    return (<CustomIcon/>)
}
export default SettingsIcon;
