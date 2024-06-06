const humanizeDuration = require("humanize-duration");
import {HumanizerConfig} from "@lib/constants";

export const shortEnglishHumanizer = humanizeDuration.humanizer(HumanizerConfig);
