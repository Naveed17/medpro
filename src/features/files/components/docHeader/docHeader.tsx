import React from "react";

function DocHeader({...props}) {
    const {data} = props;

    return (
        <>
            {data && <div style={{display: "grid", gridTemplateColumns: 'repeat(2, 1fr)',padding:10}}>
                <div style={{gridColumn: 1 / 2,textAlign:"left"}}>
                    <p style={{margin: 0, fontWeight: "bold",fontSize:26, color: "#0696D6",marginBottom: 5}}>{data.left1}</p>
                    <p style={{margin: 0, fontSize: 18, fontWeight: "bold"}}>{data.left2}</p>
                    <p style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "grey",
                        whiteSpace: 'pre-line'
                    }}>{data.left3}</p>
                </div>
                {/*<div style={{gridColumn: 1/3}}></div>*/}
                <div style={{textAlign: "right", gridColumn: 1 / 2}}>
                    <p style={{margin: 0, fontWeight: "bold", color: "#0696D6",fontSize:26}}>{data.right1}</p>
                    <p style={{margin: 0, fontSize: 18, fontWeight: "bold"}}>{data.right2}</p>
                    <p style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "grey",
                        whiteSpace: 'pre-line'
                    }}>{data.right3}</p>
                </div>
            </div>}
        </>
    )
}

export default DocHeader
