export const data = [
    {
        label: 'Ophtalmologie',
        color: '#FEBD15',
    },
    {
        label: 'Dentaire Enfants',
        color: '#FF9070'
    },
    {
        label: 'Dentaire Adultes',
        color: '#9A5E8A'
    },
    {
        label: 'Modèle 2',
        color: '#96B9E8'
    },
    {
        label: 'Générale',
        color: "#72D0BE"
    }
];
export const modalConfig = [
    {
        label: 'Géneral',
        name: "general",
        children: [
            {
                label: "Poids (kg)",
                name: 'poids'
            },
            {
                label: "Taille (cm)",
                name: 'taille'
            },
            {
                label: "IMC (kg/m²)",
                name: 'imc'
            },
            {
                label: "Temprature (°C)",
                name: 'temperature'
            },
            {
                label: "Diabète",
                name: 'diabete'
            }
        ]
    },
    {
        'label': "Cardio",
        name: "cardio",
    },
    {
        label: 'Autre',
        name: 'autre',
    }

]