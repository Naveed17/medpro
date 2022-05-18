import styles from "../../styles/Home.module.scss";
import {NextPage} from "next";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import {useAppDispatch} from "../../app/hooks";
import {setTheme} from "../setConfig/actions";

const Dashboard: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const currentLang =  router.locale;
    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    const handleChange = (event: SelectChangeEvent) => {
        const lang = event.target.value as string;
        router.push(router.pathname, router.pathname, { locale: lang });
    };

    const toggleTheme = (mode: string) => {
        dispatch(setTheme(mode));
    }

    return(
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
            </div>
        </main>
        )
}

export default Dashboard
