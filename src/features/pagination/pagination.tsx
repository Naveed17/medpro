import * as React from "react";
import {Pagination as BasicPagination} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";

export default function Pagination({...props}) {
    const {total, count, pageTotal = 10, ...rest} = props;
    const router = useRouter();
    const currentPage = parseInt(new URL(location.href).searchParams.get("page") || "1");

    const [page, setPage] = React.useState<number>(currentPage);

    const {t} = useTranslation("common");

    React.useEffect(() => {
        setPage(currentPage);
    }, [currentPage]);

    return (
        <Box
            display="flex"
            my={1}
            justifyContent="space-between"
            alignItems="center"
            {...rest}>
            <Typography variant="body1" color="text.primary">
                {page * pageTotal - (pageTotal - 1)} -{" "}
                {total < page * pageTotal ? total : page * pageTotal} {t("of")} {total}
            </Typography>
            <BasicPagination
                onChange={(e, v) => {
                    const previousPage = page;
                    setPage(v);
                    router.replace({
                        query: {page: v, previousPage},
                    });
                }}
                count={count}
                page={page}
                color="primary"
            />
        </Box>
    );
}
