interface Qualifications {
  step1: {
    group: string;
    name: string;
    firstName: string;
    dob: {
      day: string;
      month: string;
      year: string;
    };
    phone: number;
    gender: string;
  };
  step2: {
    region: string;
    zipCode: number;
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
