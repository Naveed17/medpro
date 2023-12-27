export const new_feature_data = [
    {
        id: 1,
        title: "l'Intelligence Artificielle(IA)\n Transforme Votre Voix en Notes \n Cliniques",
        description: "Il est possible d'utiliser des enregistrements vocaux en collaboration avec l'intelligence artificielle(IA) pour simplifier la rédaction de vos notes cliniques.\n" +
            "Grâce à des technologies avancées, l'IA convertit\n" +
            "automatiquement les enregistrements vocaux \n" +
            "en texte écrit, offrant une méthode qui optimisel'efficacité de la documentation médicale.",
        img: "new_feature-1"
    },
    {
        id: 2,
        title: "Collaboration Visuelle:Croissance de l'Enfant",
        description: "Facilitez la communication avec les parents en partageant visuellement les données de croissance, favorisant ainsi une compréhension mutuelle et une implication active des familles dans la santé de l'enfant.",
        img: "new_feature-2"
    },
    {
        id: 3,
        title: "Centralisez la Gestion \n de votre Cabinet Médical",
        description: "La fonctionnalité de la dashboard unique dans medlink offre à la secrétaire une interface centralisée pour superviser divers aspects du cabinet médical. \n" +
            "À partir de cette unique plateforme, la secrétaire peut efficacement gérer la salle d'attente, coordonner les rendez-vous des patients, et traiter les fiches médicales. \n" +
            "De plus, la fonctionnalité inclut la gestion de la caisse, permettant une prise en charge complète des activités administratives et opérationnelles.",
        img: "new_feature-3"
    },
    {
        id: 4,
        title: "MedLink Mobile: Enrichissez les Dossiers Patients en Instantané",
        description: "MedLink offre une fonctionnalité novatrice permettant aux médecins et à l'assistante d'enrichir facilement le dossier patient avec des photos, analyses, et documents médicaux via un smartphone équipé d'un appareil photo. Cette fonction simplifie le processus d'ajout d'informations cruciales au dossier électronique, offrant une capture instantanée et une intégration fluide des documents médicaux pertinents.",
        img: "new_feature-4"
    },
    {
        id: 5,
        title: "MedLink Stats: Visualisez et Optimisez l'Activité de Votre Cabinet Médical",
        description: "La nouvelle section statistiques dans Medlink offre au médecin une vision complète du flux de son cabinet. Il permet de visualiser des statistiques clés, notamment le nombre de consultations effectuées, les motifs de consultation les plus fréquents, et les actes médicaux réalisés.",
        img: "new_feature-5"
    },
    {
        id: 6,
        title: "Nouvelle Fonction de Pause -Reprise de Consultation",
        description: "La dernière mise à jour de MedLink introduit une fonctionnalité révolutionnaire : \n" +
            "la possibilité de mettre en pause et de reprendre les consultations en toute simplicité. \n" +
            "Cette nouvelle fonction offre aux professionnels de la santé une flexibilité accrue lors des rendez-vous médicaux. \n" +
            "Désormais, les médecins peuvent interrompre une consultation en cours, répondre à des urgences, puis reprendre la session là où elle s'était arrêtée, assurant ainsi une continuité efficace des soins.",
        img: "new_feature-6"
    },
    {
        id: 7,
        title: "Enregistrez et Simplifiez avec les Modèles de Posologies et d'Observations Cliniques",
        description: "La dernière version de medlink vous permet d'enregistrer des modèles de posologies et d'observations cliniques personnalisés. \n" +
            "Facilitant la prescription médicale, créez des modèles détaillés avec doses, fréquences et durées. \n" +
            "Les modèles d'observations  cliniques simplifient\n" +
            "la documentation en permettant de pré-enregistrer des notes standardisées pour divers symptômes, examens physiques et résultats de tests.",
        img: "new_feature-7"
    },
    {
        id: 8,
        title: "Module d'Export Comptable Intégré",
        description: "L’option permet d'exporter les transactions de la caisse dans un format CSV, cette option permet au comptable de recevoir des données structurées, simplifiant ainsi le processus de traitement comptable et assurant la conformité aux normes professionnelles.",
        img: "new_feature-8"
    },
    {
        id: 9,
        title: "Configuration de congé",
        description: "La fonctionnalité de gestion des congés et des absences simplifie la vie professionnelle en permettant de bloquer facilement les périodes d'indisponibilité directement depuis l'agenda. \n" +
            "Cette facilité d'utilisation garantit que les patients ne peuvent pas prendre de rendez-vous pendant ces périodes, assurant ainsi une gestion efficace du temps et un agenda clair pour les professionnels.",
        img: "new_feature-9"
    },
    {
        id: 10,
        title: "Maîtrisez votre Emploi du Temps",
        description: "La dernière mise à jour de l'agenda dans MedLink introduit une fonctionnalité visant à vous offrir une perspective rapide et claire sur la saturation de vos journées. \n" +
            "Désormais, chaque jour est représenté par une couleur distinctive en fonction de son niveau de charge, vous permettant de visualiser instantanément les périodes de haute activité et les moments plus calmes.",
        img: "new_feature-10"
    },

]
// ----------------------------------------------------------------------

const DISTANCE = 120;

const TRANSITION_ENTER = {
    duration: 0.64,
    ease: [0.43, 0.13, 0.23, 0.96]
};
const TRANSITION_EXIT = {
    duration: 0.48,
    ease: [0.43, 0.13, 0.23, 0.96]
};

export const varFadeIn = {
    initial: {opacity: 0},
    animate: {opacity: 1, transition: TRANSITION_ENTER},
    exit: {opacity: 0, transition: TRANSITION_EXIT}
};

export const varFadeInUp = {
    initial: {y: 35, opacity: 0},
    animate: {y: 0, opacity: 1, transition: TRANSITION_ENTER},
    exit: {y: 35, opacity: 0, transition: TRANSITION_EXIT}
};

export const varFadeInLeft = {
    initial: {x: -DISTANCE, opacity: 0},
    animate: {x: 0, opacity: 1, transition: TRANSITION_ENTER},
    exit: {x: -DISTANCE, opacity: 0, transition: TRANSITION_EXIT}
};

export const varFadeInDown = {
    initial: {y: -35, opacity: 0},
    animate: {y: 0, opacity: 1, transition: TRANSITION_ENTER},
    exit: {y: -35, opacity: 0, transition: TRANSITION_EXIT}
};

export const varFadeInRight = {
    initial: {x: DISTANCE, opacity: 0},
    animate: {x: 0, opacity: 1, transition: TRANSITION_ENTER},
    exit: {x: DISTANCE, opacity: 0, transition: TRANSITION_EXIT}
};
