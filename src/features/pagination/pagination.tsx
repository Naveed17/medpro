import * as React from "react";
import {Pagination as BasicPagination, MenuItem, Select} from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";

export default function Pagination({...props}) {
    const {total, count, pageTotal = 10, ...rest} = props;
    const router = useRouter();
    const currentPage = parseInt(
        new URL(location.href).searchParams.get("page") || "1"
    );

    const [page, setPage] = React.useState<number>(currentPage);
    const [limit, setLimit] = React.useState<any>(
        router.query.limit || "10"
    );
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
            <Stack spacing={2} direction="row" alignItems="center">
               {/* <Typography variant="body2" color="#687182">
                    {t("rows_per-page")}
                </Typography>
                <Select
                    value={limit}
                    onChange={(e: any) => {
                        setLimit(e.target.value);
                        router.replace({
                            query: {page, limit: e.target.value},
                        });
                    }}
                    size="small"
                    sx={{
                        ".MuiSelect-select": {
                            "&.MuiSelect-select": {
                                p: 0.5,
                                pl: 1,
                                pr: "20px !important",
                                bgcolor: (theme) => theme.palette.common.white,
                                "& ~ .MuiSvgIcon-root": {
                                    right: 0,
                                    width: 20,
                                    height: 20,
                                    top: "calc(50% - 0.450em)",
                                },
                            },
                        },
                    }}
                >
                    {[10, 20, 50].map((item) => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>*/}
                <BasicPagination
                    onChange={(e, v) => {
                        setPage(v);
                        router.replace({
                            query: {page: v},
                        });
                    }}
                    count={count}
                    page={page}
                    color="primary"
                />
            </Stack>
        </Box>
    );
}
