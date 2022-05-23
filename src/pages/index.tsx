import type { NextPage } from 'next'
import styles from '../styles/Home.module.scss'
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import HouseIcon from '@mui/icons-material/House';
import {setTheme} from "@features/setConfig/actions";
import {useRouter} from "next/router";
import {useAppDispatch} from "@app/redux/hooks";
import dynamic from 'next/dynamic';
const Footer = dynamic(() => import('@features/base/footer'));

const Home: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { t, ready } = useTranslation('common');
    const dir = router.locale === 'ar' ? 'rtl': 'ltr';

    if (!ready) return (<>loading translations...</>);
    const currentLang =  router.locale;
    const handleChange = (event: SelectChangeEvent) => {
        const lang = event.target.value as string;
        router.push(router.pathname, router.pathname, { locale: lang });
    };

    const toggleTheme = (mode: string) => {
        dispatch(setTheme(mode));
    }

  return (
    <div className={styles.container} dir={dir}>

        <main className={styles.main}>
            <h1 className={styles.title}>
                <a> {t('welcome')}</a>
            </h1>
            <Box sx={{ minWidth: 120 }} style={{marginTop: '1rem'}}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t('lang')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={currentLang}
                        label="Age"
                        onChange={handleChange}>
                        <MenuItem value='fr'>FR</MenuItem>
                        <MenuItem value='en'>EN</MenuItem>
                        <MenuItem value='ar'>AR</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <p className={styles.description}>
                {t('start') + ' '}
                <code className={styles.code}>pages/index.tsx</code>
            </p>

            <div className={styles.grid}>
                <a href="#" onClick={() => toggleTheme('light')} className={styles.card}>
                    <WbSunnyIcon />
                    <p>{t('light')}</p>
                </a>

                <a href="#" onClick={() => toggleTheme('dark')} className={styles.card}>
                    <BedtimeIcon/>
                    <p>{t('dark')}</p>
                </a>

                <a href="#" onClick={() => router.push('dashboard')} className={styles.card}>
                    <HouseIcon/>
                    <p>{t('dashboard')}</p>
                </a>
            </div>
        </main>

        <Footer/>
    </div>
  )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common']))
    }
})
export default Home
