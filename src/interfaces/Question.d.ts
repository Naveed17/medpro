interface Patient {
    illness: string;
    countary: string;
    city: string;
    height: number;
    weight: number;
    medicalBackground: string;
    medicalTreatments: string;
}

interface Question {
    id: number | null;
    date: string;
    question: string;
    patient: Patient | null;
    category: string;
};