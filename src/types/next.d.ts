import type { NextComponentType, NextPageContext } from "next"
import type { Session } from "next-auth"
import type { Router } from "next/router"

declare module "next/app" {
  type AppProps<P = Record<string, unknown>> = {
    Component: NextComponentType<NextPageContext, any, P>  & { auth: boolean }
    router: Router
    __N_SSG?: boolean
    __N_SSP?: boolean
    jwt?: any
    pageProps: P & {
      /** Initial session passed in from `getServerSideProps` or `getInitialProps` */
      session?: Session
      fallback?: any
    }
  }
}
