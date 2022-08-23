import React from "react";

function ModelDot({...DotProps}) {
    const {
        color,
        selected,
        onClick,
        size = 32,
        sizedot = 20,
        padding = 5,
        marginRight= 0
    } = DotProps
    return (
        <div
            onClick={onClick}
            style={{
                boxSizing: 'border-box',
                display: 'flex',
                background: 'white',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: selected ? 4 : padding,
                gap: 10,
                marginRight,
                width: size,
                height: size,
                border: selected ? '2px solid #0696D6' : '1px solid #EAEAEA',
                borderRadius: 30,
                flex: 'none',
                order: 0,
                flexGrow: 0
            }}>
            <div style={{
                width: sizedot,
                height: sizedot,
                borderRadius: 30,
                background: color,
                flex: 'none',
                order: 0,
                flexGrow: 0
            }}></div>
        </div>
    );
}

export default ModelDot;


