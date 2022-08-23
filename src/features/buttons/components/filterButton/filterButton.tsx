import IconUrl from "@themes/urlIcon";
import React, {useState} from "react";
import FilterButtonStyled from "./overrides/filterButtonStyled";
import {DrawerBottom} from "@features/drawerBottom";

function FilterButton({children}: LayoutProps) {
    const [opened, setOpened] = useState<boolean>(false);
    return (
        <>
            <FilterButtonStyled
                startIcon={<IconUrl path="ic-filter"/>}
                onClick={() => setOpened(true)}
                variant="filter"
            >
                Filter (0)
            </FilterButtonStyled>
            <DrawerBottom
                handleClose={() => setOpened(false)}
                open={opened}
                title={null}
            >
                {children}
            </DrawerBottom>

        </>

    )
}

export default FilterButton;
