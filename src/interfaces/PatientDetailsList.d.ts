interface PatientDetailsList {
  title: string;
  id: string | number;
  icon: string;
  items: {
    id: string | number;
    name: string;
  }[];
}
