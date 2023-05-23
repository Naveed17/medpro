import {useState} from "react";
import Langs from "@features/topNavBar/components/langButton/config";
import {RootStyled} from "@features/topNavBar";
import {Button} from "@mui/material";
import GlobeIcon from "@themes/overrides/icons/globeIcon";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";

function LangButton() {
    const {locale} = useAppSelector(configSelector);
    const [anchorEl, setAnchorEl] = useState(null);
    const lang = Langs[locale];
    const [selected] = useState(lang);

    const handleClick = (event: any) => {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    };

    return (
        <RootStyled>
            <Button
                startIcon={<GlobeIcon/>}
                variant="outlined"
                aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={handleClick}>
                {selected?.label}
            </Button>
        </RootStyled>
    );
}

export default LangButton;
