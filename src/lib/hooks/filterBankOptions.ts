import {FilterOptionsState} from "@mui/base/useAutocomplete/useAutocomplete";

export const filterBankOptions = (options: any[], params: FilterOptionsState<any>, t: any) => {
    const {inputValue} = params;
    const filtered = options.filter(option => [option.abbreviation.toLowerCase()].some(option => option?.includes(inputValue.toLowerCase())));
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue.toLowerCase() === option.abbreviation.toLowerCase());
    if (inputValue !== '' && !isExisting) {
        filtered.push({
            inputValue,
            abbreviation: `${t('add_reason')} "${inputValue}"`,
        });
    }

    return filtered;
}
