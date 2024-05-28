import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/router';
import IconUrl from '@themes/urlIcon';



export default function CustomBreadcrumbs({ ...props }) {
    const { data } = props;
    const router = useRouter()
    function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, route: string | null) {
        event.preventDefault();
        router.push(route as string)

    }
    const breadcrumbs = data.map((item: { title: string, href: string | null }, idx: number) => (
        item.href ?
            <Link key={idx} underline="none" sx={{ color: theme => theme.palette.grey[700], fontSize: 12, fontWeight: 500, cursor: 'pointer' }} onClick={(e) => handleClick(e, item.href)}>
                {item.title}
            </Link>
            :
            <Typography key={idx} variant='body2' fontWeight={500} color='primary'>
                {item.title}
            </Typography>

    ))




    return (
        <Breadcrumbs
            separator={<IconUrl path="ic-arrow-right" />}
            aria-label="breadcrumb"
        >
            <IconUrl path='ic-home-outline' />
            {breadcrumbs}
        </Breadcrumbs>

    );
}
