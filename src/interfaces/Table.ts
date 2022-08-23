interface Table {
  patient: PatientWithNextAndLatestAppointment | null;
  addAmount: string | number;
}
export default Table;
