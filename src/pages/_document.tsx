import * as React from "react";
import Document, {
    Html,
    Head,
    Main,
    NextScript
} from "next/document";
import Script from 'next/script';

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
                    {/* upscope integration. */}
                    <Script
                        src="/static/files/upscope.js"
                        strategy="lazyOnload"
                    />
                    {/* usetiful integration. */}
                    <Script
                        src="/static/files/usetifulWorker.js"
                        strategy="lazyOnload"
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
