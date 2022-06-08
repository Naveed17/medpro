import * as React from 'react';
import Document, {Html, Head, Main, NextScript, DocumentContext} from 'next/document';
import createCache from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";
import {prefixer} from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="fr">
                <Head>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Poppins:300,400&display=swa"
                    />
                    {/* Inject MUI styles first to match with the prepend: true configuration. */}
                    {(this.props as any).emotionStyleTags}
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }


    // `getInitialProps` belongs to `_document` (instead of `_app`),
    // it's compatible with static-site generation (SSG).
    static async getInitialProps(ctx: DocumentContext) {
        const originalRenderPage = ctx.renderPage;
        const cache = createCache({
            key: 'css',
            prepend: true
        });
        const { extractCriticalToChunks } = createEmotionServer(cache);

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App: any) =>
                    function EnhanceApp(props) {
                        return <App emotionCache={cache} {...props} />;
                    },
            });

        const initialProps = await Document.getInitialProps(ctx);
        const emotionStyles = extractCriticalToChunks(initialProps.html);
        const emotionStyleTags = emotionStyles.styles.map((style) => (
            <style
                data-emotion={`${style.key} ${style.ids.join(' ')}`}
                key={style.key}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: style.css }}
            />
        ));

        return {
            ...initialProps,
            emotionStyleTags,
        };
    }
}

export default MyDocument;

