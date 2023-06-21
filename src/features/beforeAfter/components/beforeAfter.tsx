import React from "react";
import RootStyled from "@features/beforeAfter/components/overrides/bAStyled";

function BeforeAfter({...props}) {

    return (
        <RootStyled>
            <div className='container'>
                <div className='img background-img'></div>
                <div className='img foreground-img' id={"foreground-img"}></div>
                <input type="range" min="1" max="100" value="50"
                       className="slider"
                       name='slider'
                       onChange={(e) => {
                           const sliderPos = e.target.value;
                           const el1 = document.getElementById('foreground-img');
                           const el2 = document.getElementById('slider-container');
                           if (el1 && el2) {
                               el1.style.width = `${sliderPos}%`;
                               el2.style.left = `calc(${sliderPos}% - 18px)`;
                           }
                       }
                       }
                       id="slider"/>
                <div className={'slider-container'} id={"slider-container"}>
                    <div className='slider-row' id={"slider-row"}></div>
                    <div className='slider-button' id={"slider-button"}>
                        <div className={"flesh-1"}></div>
                        <div className={"flesh-2"}></div>
                    </div>
                    <div className='slider-row' id={"slider-row"}></div>

                </div>
            </div>
        </RootStyled>
    );
}

export default BeforeAfter;
