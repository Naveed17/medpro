import * as React from "react";
import Document, {
    Html,
    Head,
    Main,
    NextScript
} from "next/document";
import Script from 'next/script';
import {Partytown} from '@builder.io/partytown/react';

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
                    <Partytown debug={true} forward={['dataLayer.push']}/>
                    <script
                        type="text/javascript"
                        crossOrigin={"anonymous"}
                        dangerouslySetInnerHTML={{
                            __html: '(function(w, u, d){var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};\n' +
                                '                        var l = function(){var s=d.createElement(\'script\');s.type=\'text/javascript\';s.async=true;\n' +
                                '                        s.src=\'https://code.upscope.io/sASRVsqUBF.js\';\n' +
                                '                        var x=d.getElementsByTagName(\'script\')[0];x.parentNode.insertBefore(s,x);};\n' +
                                '                        if(typeof u!=="function"){w.Upscope=i;l();}})(window, window.Upscope, document);\n' +
                                '\n' +
                                '                        Upscope(\'init\');',
                        }}
                    />
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
