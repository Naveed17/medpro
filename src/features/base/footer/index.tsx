import styles from '@styles/Home.module.scss'
import {useTranslation} from "next-i18next";
import Image from 'next/image'

function Index() {
    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

  return (
      <footer className={styles.footer}>
          <p>
              {t('powered_by') + ' '}
              <span className={styles.logo}>
            <Image src="/static/icons/Med-logo.png" alt="Med Logo" width={30} height={30} />
          </span>
          </p>
      </footer>

 )
}
export default Index
