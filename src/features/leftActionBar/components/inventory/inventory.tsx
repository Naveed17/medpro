import React from "react";
import { ProductFilter } from "./components";
import { useTranslation } from "next-i18next";
import { Accordion } from "@features/accordion";
import { useRouter } from "next/router";
import { useAppSelector } from "@lib/redux/hooks";
import { leftActionBarSelector } from "@features/leftActionBar";
import { prepareSearchKeys } from "@lib/hooks";

function Inventory() {
  const { t, ready } = useTranslation("inventory", { keyPrefix: "filter" });
  const router = useRouter();

  const { query: filter } = useAppSelector(leftActionBarSelector);
  return (
    <>
      <Accordion
        sx={{ ml: { xs: 0, md: -2.5 }, mx: { xs: -2, md: 0 } }}
        translate={{
          t: t,
          ready: ready,
        }}
        defaultValue={""}
        setData={() => {}}
        data={[
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
                        query: { params: queryData },
                      }),
                    },
                    "/dashboard/inventory",
                    { shallow: true }
                  );
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
}

export default Inventory;
