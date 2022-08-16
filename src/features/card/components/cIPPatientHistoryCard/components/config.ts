

export const CIPPatientHistoryCardData = [
    {
        title: 'reason_for_consultation',
        date: '12/12/2019',
        icon: 'ic-archive',
        type: "check",
        weight: 87,
        height: 177,
        temperature: 37.5,
        diseases: [
            'angina',
            "ear_infections",
        ],
        collapse:
            [
                {
                    id: 1,
                    title: 'treatment_medication',
                    icon: 'ic-traitement',
                },
                {
                    id: 2,
                    title: 'medical_imaging',
                    icon: 'ic-soura',
                }
            ],

    },
    {
        title: 'balance_results',
        date: '12/12/2019',
        icon: 'ic-doc'
    },
    {
        title: 'vaccine',
        date: '12/12/2019',
        icon: 'ic-vaccin'
    }
]