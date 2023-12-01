import {FilterOptionsState} from "@mui/base/useAutocomplete/useAutocomplete";

export const filterReasonOptions = (options: any[], params: FilterOptionsState<any>, t: any) => {
    const {inputValue} = params;
    const filtered = options.filter(option => [option.name.toLowerCase()].some(option => option?.includes(inputValue.toLowerCase())));
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue.toLowerCase() === option.name.toLowerCase());
    if (inputValue !== '' && !isExisting) {
        filtered.push({
            inputValue,
            name: `${t('add_reason')} "${inputValue}"`,
        });
    }

    return filtered;
}
