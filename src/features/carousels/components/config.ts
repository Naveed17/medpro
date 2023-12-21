export const new_feature_data = [
    {
        id:1,
        title:"l'Intelligence Artificielle(IA)\n Transforme Votre Voix en Notes \n Cliniques",
        description:"Il est possible d'utiliser des enregistrements vocaux en collaboration avec l'intelligence artificielle(IA)\n pour simplifier la rédaction de vos notes\n cliniques.Grâce à des technologies avancées, l'IA convertit automatiquement les enregistrements vocaux entexte écrit, offrant une méthode qui optimise l'efficacité de la documentation médicale.",
        img:"new_feature-1"
   },
   {
        id:2,
        title:"Collaboration Visuelle:Croissance de l'Enfant",
        description:"Facilitez la communication avec les parents en partageant visuellement les données de croissance, favorisant ainsi une compréhension mutuelle et une implication active des familles dans la santé de l'enfant.",
        img:"new_feature-2"
   },
   {
        id:3,
        title:"Dashboard MedLink : Centralisez la Gestion de votre Cabinet Médical",
        description:"La fonctionnalité de la dashboard unique dans medlink offre à la secrétaire une interface centralisée pour superviser divers aspects du cabinet médical.À partir de cette unique plateforme, la secrétaire peut efficacement gérer la salle d'attente, coordonner les rendez-vous des patients, et traiter les fiches médicales. De plus, la fonctionnalité inclut la gestion de la caisse, permettant une prise en charge complète des activités administratives et opérationnelles.",
        img:"new_feature-3"
   },
   {
        id:4,
        title:"MedLink Mobile: Enrichissez les Dossiers Patients en Instantané",
        description:"MedLink offre une fonctionnalité novatrice permettant aux médecins et à l'assistante d'enrichir facilement le dossier patient avec des photos, analyses, et documents médicaux via un smartphone équipé d'un appareil photo. Cette fonction simplifie le processus d'ajout d'informations cruciales au dossier électronique, offrant une capture instantanée et une intégration fluide des documents médicaux pertinents.",
        img:"new_feature-4"
   },
   {
        id:5,
        title:"MedLink Stats: Visualisez et Optimisez l'Activité de Votre Cabinet Médical",
        description:"La nouvelle section statistiques dans Medlink offre au médecin une vision complète du flux de son cabinet. Il permet de visualiser des statistiques clés, notamment le nombre de consultations effectuées, les motifs de consultation les plus fréquents, et les actes médicaux réalisés.",
        img:"new_feature-5"
   },
   {
    id:6,
    title:"MedLink Évolue : Nouvelle Fonction de Pause/Reprise de Consultation",
    description:"La dernière mise à jour de MedLink introduit une fonctionnalité révolutionnaire : la possibilité de mettre en pause et de reprendre les consultations en toute simplicité. Cette nouvelle fonction offre aux professionnels de la santé une flexibilité accrue lors des rendez-vous médicaux. Désormais, les médecins peuvent interrompre une consultation en cours, répondre à des urgences, puis reprendre la session là où elle s'était arrêtée, assurant ainsi une continuité efficace des soins.",
    img:"new_feature-6"
   },
   {
    id:7,
    title:"Enregistrement de Posologies Personnalisées",
    description:"de gérer facilement les rendez-vous de patientsMedlink offre une fonctionnalité d'enregistrement de posologies spécifiques pour chaque médicament, permettant une adaptation précise aux besoins de chaque patient, cette fonctionnalité optimise le processus de création d'ordonnances en accélérant la saisie des posologies personnalisées, améliorant ainsi l'efficacité des professionnels de santé.",
    img:"new_feature-7"
   },
   {
    id:8,
    title:"Module d'Export Comptable Intégré",
    description:"L’option permet d'exporter les transactions de la caisse dans un format CSV, cette option permet au comptable de recevoir des données structurées, simplifiant ainsi le processus de traitement comptable et assurant la conformité aux normes professionnelles.",
    img:"new_feature-8"
   },
   {
    id:9,
    title:"Configuration de congé",
    description:"Dans MedLink vous avez la possibilité d'ajouter aisément un congé directement depuis le calendrier.Cette action bloque simultanément la période sélectionnée, empêchant ainsi les patients de prendre des rendez-vous via le site pendant cette période de congé.",
    img:"new_feature-9"
   }

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
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: TRANSITION_ENTER },
  exit: { opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInUp = {
  initial: { y: 35, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { y: 35, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInLeft = {
  initial: { x: -DISTANCE, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { x: -DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInDown = {
  initial: { y: -35, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { y: -35, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInRight = {
  initial: { x: DISTANCE, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { x: DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};
