import React from 'react';
import moment from 'moment';

interface AppProps {
    daysInMonth: number,
    theme?: string,
    currentDate: string,
    onWeekClick: (startDate: string, endDate: string) => void,
}


export const CalendarTable = (appProps: AppProps) => {

    const weekDays: string[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    const getDaysBefore = (currentDate: string): string[] => {
        const startDay = moment(currentDate).startOf('month').day();
        let daysBefore: string[] = [];
        if(startDay !== 0) {
            for(let i=(startDay-2); i>=0; i--) {
                const lastDayOfPreviousMonth = moment(currentDate).subtract(1, 'months').endOf('month');
                const previousDay = lastDayOfPreviousMonth.subtract(i, 'days');
                daysBefore.push(previousDay.format('DD MMM YYYY'));
            }
            const lastDayOfPreviousMonth = moment(currentDate).subtract(1, 'months').endOf('month');
            daysBefore.push(lastDayOfPreviousMonth.format('DD MMM YYYY'));
        }
        return daysBefore;
    }

    const getDaysAfter = (currentDate: string): string[] => {
        const endDayMoment = moment(currentDate).endOf('month');
        const endDay = endDayMoment.day();
        let daysAfter: string[] = [];
        if(endDay !== 7) {
            for(let i=0; i<(6 - endDay); i++) {
                daysAfter.push(endDayMoment.add(1,'day').format('DD MMM YYYY'));
            }
        }
        return daysAfter;
    }

    const generateDaysArray = (currentDate: string): string[] => {
        let days: string[] = [];
        days.push(...getDaysBefore(currentDate));
        const monthStart = moment(currentDate).startOf('month');
        days.push(monthStart.format('DD MMM YYYY'));
        for(let i=2; i <=appProps.daysInMonth; i++) {
            days.push(monthStart.add(1,'day').format('DD MMM YYYY'));
        }
        days.push(...getDaysAfter(currentDate));
        return days;
    }

    const renderWeekDays = (): JSX.Element[] => {
        return weekDays.map((item, index) => {
            return <td key={index} className="font">{item}</td>
        });
    }

    const splitDaysToWeeks = (days: string[]): string[][] => {
        let results: string[][] = [];
        while(days.length) {
            results.push(days.splice(0, 7))
        }
        return results;
    }

    const renderDays = (days: string[]): JSX.Element[] => {
        return days.map((item, index) => {
            return <td key={index} className="font">{moment(item).format('D')}</td>
        })
    }

    const renderWeeks = (): JSX.Element[] => {
        const days: string[] = generateDaysArray(appProps.currentDate)
        let results: string[][] = splitDaysToWeeks(days);
        return results.map((item, index) => {
            const currentWeek = item.includes(appProps.currentDate)
            return <tr key={index} onClick={() => {appProps.onWeekClick(item[0],item[6])}} className={`row ${currentWeek? 'highlighted' : ''}`}>
                {renderDays(item)}
            </tr>
        });
    }

    return <table>
        <thead>
        <tr className="row">
            {renderWeekDays()}
        </tr>
        </thead>
        <tbody>
        {renderWeeks()}
        </tbody>
    </table>
}
