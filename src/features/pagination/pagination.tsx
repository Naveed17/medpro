import * as React from "react";
import {Pagination as BasicPagination} from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";

export default function Pagination({...props}) {
    const {total, count, pageTotal = 10, ...rest} = props;
    const router = useRouter();
    const currentPage = parseInt((new URL(location.href)).searchParams.get("page") || "1");
    const [page, setPage] = React.useState<number>(currentPage);
    const {t} = useTranslation('common');

    React.useEffect(() => {
        setPage(currentPage);
    }, [currentPage]);

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" {...rest}>
            <Typography variant="body1" color="text.primary">
                {page * pageTotal - (pageTotal - 1)} - {total < page * pageTotal ? total : page * pageTotal} {t('of')} {total}
            </Typography>
            <Stack spacing={2}>
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
