

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
                    type: 'treatment',
                    drugs: [
                        {
                            id: 1,
                            name: "Doliprane 1000",
                            dosage: "dosage_unit",
                            duration: 10,
                        },
                        {
                            id: 2,
                            name: "Doliprane 1000",
                            dosage: "dosage_unit",
                            duration: 10,
                        }
                    ]
                },
                {
                    id: 2,
                    title: 'documents',
                    icon: 'ic-document',
                    type: 'document',
                    documents: [
                        'document_1',
                        'document_2',
                    ]
                },
                {
                    id: 3,
                    title: 'bal_sheet_req',
                    icon: 'ic-document',
                    type: 'req-sheet',

                }
            ],

    },
    {
        title: 'balance_results',
        date: '12/12/2019',
        icon: 'ic-doc',
        list: [
            "list-1",
            'list-2'
        ]
    },
    {
        title: 'vaccine',
        date: '12/12/2019',
        icon: 'ic-vaccin',
        list: ['COVID-19 13544899468468497']
    }
]