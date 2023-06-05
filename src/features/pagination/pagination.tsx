import * as React from "react";
import {Pagination as BasicPagination} from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";

export default function Pagination({...props}) {
    const {total, count} = props;
    const router = useRouter();
    const {page: currentPage} = router.query;
    const [page, setPage] = React.useState<number>(1);
    const {t} = useTranslation('common');

    React.useEffect(() => {
        setPage(parseInt((currentPage as any) || "1"));
    }, [currentPage]);

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color="text.primary">
                {page * 10 - 9} - {total < page * 10 ? total : page * 10} {t('of')} {total}
            </Typography>
            <Stack spacing={2}>
                <BasicPagination
                    onChange={(e, v) => {
                        setPage(v);
                        router.push({
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
