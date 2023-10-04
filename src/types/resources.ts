// place it where you store your types
// import all namespaces for default language only
import common from '../../public/locales/fr/common.json'
import menu from '../../public/locales/fr/menu.json'
import agenda from '../../public/locales/fr/agenda.json'
import waitingRoom from '../../public/locales/fr/waitingRoom.json'
import editProfile from '../../public/locales/fr/editProfile.json'
import settings from '../../public/locales/fr/settings.json'
import patient from "../../public/locales/fr/patient.json";
import consultation from "../../public/locales/fr/consultation.json";
import payment from "../../public/locales/fr/payment.json";
import inventory from "../../public/locales/fr/inventory.json";

export interface Resources {
    common: typeof common
    menu: typeof menu
    agenda: typeof agenda
    waitingRoom: typeof waitingRoom
    editProfile: typeof editProfile
    settings: typeof settings
    patient: typeof patient;
    consultation: typeof consultation;
    payment: typeof payment;
    inventory: typeof inventory;
    // as many as files you have
}
