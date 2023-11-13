export const dosageMeal = [
    {
        label: "before_meal",
        value: "before meal",
    },
    {
        label: "after_meal",
        value: "after meal",
    },
    {
        label: "with_meal",
        value: "with meal",
    },
    {
        label: "fasting",
        value: "fasting",
    },
];

export const duration = [
    {
        label: "day",
        value: "day",
    },
    {
        label: "week",
        value: "week",
    },
    {
        label: "month",
        value: "month",
    },
    {
        label: "year",
        value: "year",
    }
];

export const initPrescriptionCycleData = {
    drug: null,
    unit: null,
    cycles: [
        {
            dosageDuration: 1,
            dosageMealValue: "",
            durationValue: "",
            dosageInput: false,
            cautionaryNoteInput: false,
            dosageInputText: "",
            cautionaryNote: "",
            dosageTime: [
                {
                    label: "morning",
                    value: false,
                    count: 2,
                    qty: "1"
                },
                {
                    label: "mid_day",
                    value: false,
                    count: 2,
                    qty: "1"
                },
                {
                    label: "evening",
                    value: false,
                    count: 2,
                    qty: "1"
                },
                {
                    label: "before_sleeping",
                    value: false,
                    count: 2,
                    qty: "1"
                },
            ],
            dosageMeal,
            duration
        },
    ]
};
