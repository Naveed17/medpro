import React, {MouseEventHandler} from "react";

type DotProps = {
    color: string,
    selected: boolean,
    onClick?: MouseEventHandler
};

function ModelDot({color, selected, onClick}: DotProps) {
    return (
        <div
            onClick={onClick}
            style={{
                boxSizing: 'border-box',
                display: 'flex',
                background: 'white',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: selected ? 4 : 5,
                gap: 10,
                width: 32,
                height: 32,
                border: selected ? '2px solid #0696D6' : '1px solid #EAEAEA',
                borderRadius: 30,
                flex: 'none',
                order: 0,
                flexGrow: 0
            }}>
            <div style={{
                width: 20, height: 20, borderRadius: 30, background: color, flex: 'none',
                order: 0,
                flexGrow: 0
            }}></div>
        </div>
    );
}

export default ModelDot;


