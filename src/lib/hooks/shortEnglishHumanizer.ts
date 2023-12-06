const humanizeDuration = require("humanize-duration");
import {humanizerConfig} from "@lib/constants";

export const shortEnglishHumanizer = humanizeDuration.humanizer(humanizerConfig);
