// ie: ./lib/i18n/getServerTranslations.ts
import type {SSRConfig, UserConfig} from 'next-i18next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import nextI18nextConfig from '../../../next-i18next.config.cjs';

export const getServerTranslations = async (
    locale: string,
    namespacesRequired?: string | string[] | undefined,
    configOverride?: UserConfig,
    extraLocales?: string[] | false
): Promise<SSRConfig> => {
    const config = configOverride ?? nextI18nextConfig
    return serverSideTranslations(locale, namespacesRequired, config, extraLocales)
}
