interface DepartmentModel {
    createdAt: string;
    name: string;
    uuid: string;
    status: number;
    headOfService: {
        firstName: string;
        isAccepted: boolean;
        isActive: boolean;
        isOwner: boolean;
        isPublic: boolean;
        lastName: string;
        uuid: string;
    }
}
