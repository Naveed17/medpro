import React from "react";
import {TextField} from "@mui/material";

function DocHeaderEditor({...props}) {
    const {header, setHeader} = props;

    return (
        <>
            {header && <div style={{display: "grid", gridTemplateColumns: 'repeat(2, 1fr)', padding: 10}}>
                <div style={{textAlign: "left", gridColumn: 1 / 2}}>
                    <TextField value={header.left1}
                               sx={{marginBottom: 1}}
                               inputProps={{
                                   style: {
                                       fontWeight: "bold", fontSize: 20, color: "#0696D6"
                                   }
                               }}
                               onChange={(ev) => {
                                   header.left1 = ev.target.value
                                   setHeader({...header})
                               }}/>
                    <TextField value={header.left2}
                               sx={{marginBottom: 1}}
                               inputProps={{
                                   style: {
                                       fontWeight: "bold", fontSize: 19,
                                   }
                               }}
                               onChange={(ev) => {
                                   header.left2 = ev.target.value
                                   setHeader({...header})
                               }}/>
                    <TextField value={header.left3} onChange={(ev) => {
                        header.left3 = ev.target.value
                        setHeader({...header})
                    }}/>
                </div>
                {/*<div style={{gridColumn: 1/3}}></div>*/}
                <div style={{textAlign: "right", gridColumn: 1 / 2}}>
                    <TextField value={header.right1}
                               sx={{marginBottom: 1}}
                               inputProps={{
                                   style: {
                                       fontWeight: "bold", fontSize: 20, color: "#0696D6"
                                   }
                               }}
                               onChange={(ev) => {
                                   header.right1 = ev.target.value
                                   setHeader({...header})
                               }}/>
                    <TextField value={header.right2}
                               sx={{marginBottom: 1}}
                               inputProps={{
                                   style: {
                                       fontWeight: "bold", fontSize: 19,
                                   }
                               }}
                               onChange={(ev) => {
                                   header.right2 = ev.target.value
                                   setHeader({...header})
                               }}/>
                    <TextField value={header.right3} onChange={(ev) => {
                        header.right3 = ev.target.value
                        setHeader({...header})
                    }}/>
                </div>
            </div>}
        </>
    )
}

export default DocHeaderEditor
