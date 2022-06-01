// components
import {CalandarPickers} from "@features/calandarPickers";
import {SideBarAccordion} from "@features/sideBarAccordion";
import {BoxStyled} from "@features/leftActionBar";

function AgendaActionBar() {

    return (
        <BoxStyled>
            <CalandarPickers />
            <SideBarAccordion />
        </BoxStyled>
    )
}

export default AgendaActionBar
