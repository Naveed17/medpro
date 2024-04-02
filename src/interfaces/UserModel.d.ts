interface UserModel {
    agendaDefaultFormat?: string;
    uuid: string;
    userUuid?: string;
    firstName: string;
    lastName: string;
    email: string;
    cin?: string;
    address?: string;
    birthDate: string;
    isActive: boolean;
    isProfessional: boolean;
    isIntern: boolean;
    gender: string;
    roles: string[];
    contacts?: ContactModel[];
    department?: DepartmentModel[];
    slots?: any;
}
