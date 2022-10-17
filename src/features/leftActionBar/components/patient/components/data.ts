const rightActionData = {
  filter: {
    collapse: [
      {
        heading: {
          icon: "ic-patient",
          title: "patient",
        },

        gender: {
          heading: "gender",
          genders: ["male", "female"],
        },
        textField: {
          labels: [
            { label: "name", placeholder: "name" },
            { label: "date-of-birth", placeholder: "--/--/----" },
            { label: "telephone", placeholder: "telephone" },
          ],
        },
      },
      {
        heading: {
          icon: "ic-pin",
          title: "place",
        },
        country: {
          heading: "country",
          placeholder: "enter-country",
        },
        city: {
          heading: "city",
          placeholder: "enter-city"
        }
      },
   /*   {
        heading: {
          icon: "ic-patient",
          title: "appointment",
        },
        type: {
          heading: "type",
          types: [
            { text: "video", icon: "ic-video" },
            { text: "appointment", icon: "ic-cabinet" },
          ],
        },
      },*/
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
export default rightActionData;
