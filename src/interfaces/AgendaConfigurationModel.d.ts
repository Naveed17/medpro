interface AgendaConfigurationModel {
    uuid: string;
    name: string;
    type: string;
    isActive: boolean;
    isDefault: boolean;
    isPublic: boolean;
    isAutoConfirm: boolean;
    hasOnlineAppointment: boolean;
    appointmentType: AppointmentTypeModel[];
    openingHours: OpeningHoursModel[];
    mutate: Function[];
}
