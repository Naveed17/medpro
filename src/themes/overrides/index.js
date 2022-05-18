import { merge } from "lodash";
import Button from "./button";
import Switch from "./switch";
import Paper from "./paper";
import Radio from "./radio";
import ControlLabel from "./controlLabel";
import TextField from "./textfield";
import Checkbox from "./checkbox";
import Select from "./select";
import IconButton from "./iconButton";
import Table from "./table";
import FormControl from "./formControl";
import Autocomplete from "./autocomplete";
import Pickers from "./pickers";
import Accordion from "./accordion";
import Backdrop from "./backDrop";
import Dialog from "./dialog";
import Pagination from "./pagination";
import Avatar from "./avatar";
import Card from "./card";
import Fab from "./calendarpicker";
import CalendarPicker from "./fab";
import Tabs from './tabs'
// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return merge(
    Button(theme),
    Switch(theme),
    Paper(theme),
    Radio(theme),
    ControlLabel(theme),
    TextField(theme),
    Checkbox(theme),
    IconButton(theme),
    Table(theme),
    Select(theme),
    FormControl(theme),
    Autocomplete(theme),
    Pickers(theme),
    Accordion(theme),
    Backdrop(theme),
    Dialog(theme),
    Pagination(theme),
    Avatar(theme),
    Card(theme),
    CalendarPicker(theme),
    Fab(theme),
    Tabs(theme)
  );
}
