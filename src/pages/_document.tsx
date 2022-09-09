import * as React from "react";
import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
} from "next/document";
import createCache from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="fr">
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                    <link rel="manifest" href="/site.webmanifest"/>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Poppins:300,400,600&display=swa"
                    />
                    {/* Inject MUI styles first to match with the prepend: true configuration. */}
                    {(this.props as any).emotionStyleTags}
                    <link
                        rel="stylesheet"
                        href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
                        integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
                        crossOrigin=""
                    />
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }

    // `getInitialProps` belongs to `_document` (instead of `_app`),
    // it's compatible with static-site generation (SSG).
    static async getInitialProps(ctx: DocumentContext) {
        const originalRenderPage = ctx.renderPage;
        const cache = createCache({
            key: "css",
            prepend: true,
        });
        const {extractCriticalToChunks} = createEmotionServer(cache);

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
                data-emotion={`${style.key} ${style.ids.join(" ")}`}
                key={style.key}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{__html: style.css}}
            />
        ));

        return {
            ...initialProps,
            emotionStyleTags,
        };
    }
}

export default MyDocument;
