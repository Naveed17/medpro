import React from 'react';
import {Button} from "@mui/material";
import {NavBar} from "@features/weekDayPicker/components/navBar";
import {CalendarTable} from "@features/weekDayPicker/components/calendarTable";
import CalendarTableStyled from "@features/weekDayPicker/components/overrides/calendarTableStyled";

interface AppProps {
    theme?: string,
    month: string,
    year: string,
    daysInMonth: number,
    onPreviousClick: () => void,
    onNextClick: () => void,
    onJumpToCurrentWeek: () => void,
    onWeekClick: (startDate: string, endDate: string) => void,
    onJumpToCurrentWeekRequired: boolean | undefined
    currentDate: string,
    display: boolean
}

interface AppState {

}

export class WeekCalendar extends React.Component<AppProps, AppState> {

    renderJumpButton(): JSX.Element {
        if(this.props.onJumpToCurrentWeekRequired) {
            return <div className="week-button">
                <Button onClick={this.props.onJumpToCurrentWeek}>Jump To Current Week</Button>
            </div>
        }
        return <div className="week-button">
        </div>
    }

    render() {
        return <CalendarTableStyled className={`box ${!this.props.display? 'display' : ''}`}>
            <div className="nav-bar">
                <NavBar
                    month={this.props.month}
                    year={this.props.year}
                    onPreviousClick={this.props.onPreviousClick}
                    onNextClick={this.props.onNextClick}
                />
            </div>
            <div>
                <CalendarTable
                    daysInMonth={this.props.daysInMonth}
                    currentDate={this.props.currentDate}
                    onWeekClick={this.props.onWeekClick}
                />
            </div>
            {this.renderJumpButton()}
        </CalendarTableStyled>
    }

}
