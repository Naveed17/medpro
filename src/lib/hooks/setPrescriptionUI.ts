export const setPrescriptionUI = () => {
    const localStorageSwitchUI = localStorage.getItem("prescription-switch-ui");
    const defaultPrescriptionUI = localStorageSwitchUI !== null ? JSON.parse(localStorageSwitchUI) : true
    return (`medical_prescription${defaultPrescriptionUI ? "_cycle" : ""}`);
}
