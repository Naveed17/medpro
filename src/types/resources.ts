// place it where you store your types
// import all namespaces for default language only
import common from "../../public/locales/fr/common.json";
import menu from "../../public/locales/fr/menu.json";
import agenda from "../../public/locales/fr/agenda.json";
import waitingRoom from "../../public/locales/fr/waitingRoom.json";
import patient from "../../public/locales/fr/patient.json";

export interface Resources {
  common: typeof common;
  menu: typeof menu;
  agenda: typeof agenda;
  waitingRoom: typeof waitingRoom;
  patient: typeof patient;
  // as many as files you have
}
