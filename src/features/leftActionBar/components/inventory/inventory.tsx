import React, {useState} from "react";
import {ProductFilter} from "./components";
import {useTranslation} from "next-i18next";
import {Accordion} from "@features/accordion";
import {useRouter} from "next/router";
import {useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector, FilterContainerStyles} from "@features/leftActionBar";
import {prepareSearchKeys} from "@lib/hooks";
import {Typography} from "@mui/material";

function Inventory() {
    const {t, ready} = useTranslation("inventory", {keyPrefix: "filter"});
    const router = useRouter();

    const {query: filter} = useAppSelector(leftActionBarSelector);

    const [dataInventory, setDataInventory] = useState([
        {
            heading: {
                id: "product",
                icon: "ic-agenda-jour",
                title: "product",
            },
            expanded: true,
            children: (
                <ProductFilter
                    t={t}
                    OnSearch={(data: {
                        name: string;
                        brand: [];
                        categories: [];
                        stock: [];
                        isHidden: boolean;
                        isForAppointment: boolean;
                    }) => {
                        const queryData = prepareSearchKeys({
                            ...filter,
                            inventory: {
                                ...filter?.inventory,
                                ...(data && {
                                    ...data,
                                    name: data.name,
                                    brand: data?.brand.toString(),
                                    categories: data?.categories.toString(),
                                    stock: data?.stock.toString(),
                                }),
                            },
                        } as any);
                        router.replace(
                            {
                                pathname: "/dashboard/inventory?page=1",
                                ...(queryData.length > 0 && {
                                    query: {params: queryData},
                                }),
                            },
                            "/dashboard/inventory",
                            {shallow: true}
                        );
                    }}
                />
            ),
        },
    ]);

    return (
        <FilterContainerStyles>
            <Typography
                display={{xs: "none", md: "block"}}
                variant="h6"
                sx={{py: 1.48, pl: "10px", mb: "0.21em"}}
                gutterBottom>
                {t("title")}
            </Typography>
            <Accordion
                translate={{
                    t, ready
                }}
                setData={setDataInventory}
                data={dataInventory}
            />
        </FilterContainerStyles>
    );
}

export default Inventory;
