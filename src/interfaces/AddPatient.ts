interface Qualifications {
  step1: {
    patient_group: string;
    first_name: string;
    last_name: string;
    country_code: string;
    birthdate: {
      day: string;
      month: string;
      year: string;
    };
    phone: number | "";
    gender: number;
  };
  step2: {
    region: string;
    zip_code: string;
    address: string;
    email: string;
    cin: string;
    from: string;
    insurance: {
      name: string;
      number: number;
    }[];
  };
  step3: {};
}
export default Qualifications;
