import * as React from "react";
import Document, {
    Html,
    Head,
    Main,
    NextScript
} from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang={this.props.locale}>
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                    <link rel="manifest" href="/manifest.json"/>
                    {/* Inject MUI styles first to match with to prepend: true configuration. */}
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
}

export default MyDocument;
