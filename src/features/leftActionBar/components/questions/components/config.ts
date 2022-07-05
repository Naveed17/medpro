const data = [
    {
        id: 1,
        date: '12/12/2020',
        question: 'What is the pain?',
        patient: {
            name: 'John Doe',
            illness: 'illness',
            countary: 'tn',
            city: 'Tunisia',
            height: 170,
            weight: 70,
            medicalBackground: 'medicalBackground',
            medicalTreatments: 'medicalTreatments'
        },
        category: 'category',
        reply: null
    },
    {
        id: 2,
        date: '13/12/2020',
        question: 'Are you feeling better?',
        patient: {
            name: 'Peter Doe',
            illness: 'Some illness',
            countary: 'us',
            city: 'New York',
            height: 150,
            weight: 60,
            medicalBackground: 'medicalBackground',
            medicalTreatments: 'medicalTreatments',


        },
        category: 'category',
        reply: {
            id: 1,
            date: '12/12/2020',
            reply: 'Yes, I am feeling better',
        }
    }
];
export default data;