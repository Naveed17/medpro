export const rightActionData = {
  filter: {
    title: "Filter",
    collapse: [
      {
        heading: {
          icon: "ic-patient",
          title: "User",
        },

        gender: {
          heading: "Gender",
          genders: ["male", "female"],
        },
        textField: {
          labels: [
            { label: "Name", placeholder: "Mot clé" },
            { label: "Date of birth", placeholder: "--/--/----" },
            { label: "Number phone", placeholder: "Mot clé" },
          ],
        },
      },
      {
        heading: {
          icon: "ic-pin",
          title: "Place",
        },
        city: {
          heading: "City",
          placeholder: "Text",
          cities: [
            "Lahore",
            "Karachi",
            "Islamabad",
            "Rawalpindi",
            "Quetta",
            "Peshawar",
          ],
        },
      },
      {
        heading: {
          icon: "ic-patient",
          title: "Appointment",
        },
        type: {
          heading: "Type",
          types: [
            { text: "Video", icon: "ic-video" },
            { text: "Video", icon: "ic-cabinet" },
          ],
        },
      },
    ],
  },
  history: {
    collapse: [
      {
        heading: {
          icon: "ic-patient",
          title: "Antecedents",
        },
        list: [
          {
            heading: {
              title: "Way of life",
              icon: "ic-doc",
            },
            sublist: ["Alcohol", "Tobacco", "Add a way of life"],
          },
          {
            heading: {
              title: "Antecedents",
              icon: "ic-medicament",
            },
            sublist: [
              { text: "Diabetes", icon: "ic-diabete" },
              { text: "Hypertension", icon: "ic-cardio" },
              "Add antecedent",
            ],
          },
          {
            heading: {
              title: "Allergies",
              icon: "ic-medicament",
            },
            sublist: ["Add allergies"],
          },
        ],
      },
      {
        heading: {
          icon: "ic-dowlaodfile",
          title: "Document",
        },
      },
    ],
  },
};

export const Poupupdata = {
  actionsList: [
    { icon: "ic-salle", text: "Ajouter en salle d’attentes", color: "primary" },
    { icon: "ic-messanger-lite", text: "Envoyer un msg", color: "primary" },
    { icon: "ic-dowlaodfile", text: "Import document", color: "primary" },
    { icon: "ic-printer", text: "Exporter les RDV", color: "primary" },
    { icon: "ic-x", text: "Annuler RDV", color: "primary" },
    { icon: "danger", text: "Détection doublons", color: "warning" },
    { icon: "ic-x", text: "Bloquer la prise de RDV", color: "primary" },
    { icon: "/setting/icdelete", text: "Supprimer le patient", color: "error" },
  ],
};
