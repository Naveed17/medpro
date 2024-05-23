import {StaticDatePicker as DatePicker} from '@mui/x-date-pickers';
// styles
import {RootStyled} from "./overrides";

export default function StaticDatePicker({...props}) {
    const {loading, value, onChange, onDateDisabled, ...rest} = props;

    return (
        <RootStyled className={loading ? "loading" : ""}>
            <DatePicker
                reduceAnimations
                displayStaticWrapperAs="desktop"
                shouldDisableDate={onDateDisabled}
                onChange={onChange}
                value={value}
                {...rest}
            />
        </RootStyled>
    );
}
