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
            count: 2,
            dosageQty: "1",
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
                },
                {
                    label: "mid_day",
                    value: false,
                },
                {
                    label: "evening",
                    value: false,
                },
                {
                    label: "before_sleeping",
                    value: false,
                },
            ],
            dosageMeal,
            duration
        },
    ]
};
