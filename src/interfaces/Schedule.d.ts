interface scheduleTimePiker {
    start: string
    end: string
}

interface Schedule {
    day: string
    opened: boolean
    hours: (scheduleTimePiker| null)[] | null
}
