import React from 'react';
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";

interface AppProps {
    month: string,
    year: string,
    theme?: string,
    onPreviousClick: () => void,
    onNextClick: () => void
}

export const NavBar = (appProps: AppProps) => {
    return <div className="navbar">
                <span className="item">
                    <ArrowRightIcon onClick={appProps.onPreviousClick}/>
                </span>
        <div className="item font">
                    <span className="item">
                        {appProps.month}
                    </span>
            <span className="item">
                        {appProps.year}
                    </span>
        </div>
        <span className="item">
                    <FormatAlignLeftIcon onClick={appProps.onNextClick}/>
                </span>
    </div>
}
