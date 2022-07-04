interface Patient {
    illness: string;
    countary: string;
    city: string;
    height: number;
    weight: number;
    medicalBackground: string;
    medicalTreatments: string;
}
interface Replay {
    id: number;
    date: string;
    replay: string;
}

interface Question {
    id: number | null;
    date: string;
    question: string;
    patient: Patient | null;
    category: string;
    reply?: Reply | null;
};