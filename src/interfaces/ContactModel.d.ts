interface ContactModel {
    uuid: string;
    value: string;
    name: string;
    type: string;
    contactType: string;
    isWhatsapp?: string;
    contactRelation?: number;
    contactSocial?: {
        firstName: string;
        lastName: string;
    };
    isPublic: boolean;
    isSupport: boolean;
    isVerified: boolean;
    description: string;
    code: string;
}
