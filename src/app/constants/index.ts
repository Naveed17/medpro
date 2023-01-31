import {countries} from "@features/countrySelect/countries";

export const SocialInsured = [
    {grouped: "L'assuré social", key: "socialInsured", value: "0", label: "Lui-même"},
    {grouped: "Le conjoint", key: "partner", value: "1", label: "Le conjoint"},
    {grouped: "L'ascendant", key: "father", value: "2", label: "Le Pére"},
    {grouped: "L'ascendant", key: "mother", value: "3", label: "La Mére"},
    {grouped: "L'enfant", key: "child", value: "4", label: "1er Enfant"},
    {grouped: "L'enfant", key: "child", value: "5", label: "2ème Enfant"},
    {grouped: "L'enfant", key: "child", value: "6", label: "3ème Enfant"},
    {grouped: "L'enfant", key: "child", value: "7", label: "Autre"},
];

export const PhoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const DefaultCountry = countries.find(country => country.code === process.env.NEXT_PUBLIC_COUNTRY) as CountryModel;
