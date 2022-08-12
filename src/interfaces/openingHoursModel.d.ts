interface openingHoursModel {
    isMain: boolean;
    isVisible: boolean;
    openingHours: Array<{ [key: string]: Array<{ end_time: string, start_time: string }> }>;
    uuid: string;
}
