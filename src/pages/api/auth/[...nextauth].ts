import NextAuth, {NextAuthOptions} from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
import requestAxios, {setAxiosToken} from "@app/axios/config";
import CredentialsProvider from "next-auth/providers/credentials";
import {JWT} from "next-auth/jwt";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

const refreshAccessToken = async (token: JWT) => {
    try {
        if (Date.now() > (token as any).refreshTokenExpired) {
            console.log('Error thrown');
            throw Error;
        }
        const details = {
            client_id: process.env.KEYCLOAK_ID,
            client_secret: process.env.KEYCLOAK_SECRET,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken
        };
        const formBody: string[] = [];
        Object.entries(details).forEach(([key, value]: [string, any]) => {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(value);
            formBody.push(encodedKey + '=' + encodedValue);
        });
        const formData = formBody.join('&');
        const url = process.env.KEYCLOAK_AUTH_TOKEN_URL || '';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formData
        });
        const refreshedTokens = await response.json();
        if (!response.ok) throw refreshedTokens;
        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpired: Date.now() + refreshedTokens.expires_in * 1000,
            refreshTokenExpired: Date.now() + refreshedTokens.refresh_expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken
        };
    } catch (error) {
        console.log('Token expired');
        console.log(error);
        return {
            ...token,
            error: 'RefreshAccessTokenError'
        };
    }
};

export const authOptions: NextAuthOptions = {
    // https://next-auth.js.org/configuration/providers
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID!,
            clientSecret: process.env.KEYCLOAK_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER,
            requestTokenUrl: process.env.KEYCLOAK_AUTH_TOKEN_URL
        }),
        CredentialsProvider({
            id: "credentials",
            type: "credentials",
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {},
            // @ts-ignore
            async authorize(credentials, req) {
                if (req) {
                    // Any object returned will be saved in `user` property of the JWT
                    return refreshAccessToken({refreshToken: req.body?.token});

                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })
    ],
    // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
    // https://next-auth.js.org/configuration/databases
    //
    // Notes:
    // * You must install an appropriate node_module for your database
    // * The Email provider requires a database (OAuth providers do not)
    // database: process.env.DATABASE_URL,

    // The secret should be set to a reasonably long random string.
    // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
    // a separate secret is defined explicitly for encrypting the JWT.
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        // This option can be used with or without a database for users/accounts.
        // Note: `strategy` should be set to 'jwt' if no database is used.
        strategy: 'jwt',

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours
    },

    // JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
    // option is set - or by default if no database is specified.
    // https://next-auth.js.org/configuration/options#jwt
    jwt: {
        // encode: async ({ secret, token }) => {
        //   return jwt.sign(token as any, secret);
        // },
        // decode: async ({ secret, token }) => {
        //   return jwt.verify(token as string, secret) as any;
        // },
    },

    // You can define custom pages to override the built-in ones. These will be regular Next.js pages
    // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
        signIn: '/auth/signin',  // Displays signin buttons
        signOut: '/auth/signout', // Displays form with sign out button
        error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // Used for check email page
        //newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            return !(user as any).error
        },
        async redirect({url, baseUrl}) {
            if (url.startsWith(baseUrl)) return url;
            // Allows relative callback URLs
            if (url.startsWith("/")) return new URL(url, baseUrl).toString();
            return baseUrl;
        },
        async session({session, token, user}) {
            // Send properties to the client, like an access_token from a provider.
            (session as any).accessToken = token.accessToken;
            session.data = token.data as UserDataResponse;
            if (token.error) {
                (session as any).error = token.error;
            }
            return session;
        },
        async jwt({token, user, account, profile, trigger, session}) {
            // Persist the OAuth access_token to the token right after signin
            if (trigger === "update" && session?.agenda_default_view) {
                // Note, that `session` can be any arbitrary object, remember to validate it!
                const updatedToken = {...token} as any;
                token = {
                    ...updatedToken,
                    data: {
                        ...updatedToken.data,
                        "general_information": {
                            ...updatedToken.data.general_information,
                            agendaDefaultFormat: session?.agenda_default_view
                        }
                    }
                };
                return token;
            }

            if (account && user) {
                // Send properties to the client, like an access_token from a provider.
                if (account.provider === "credentials") {
                    token = user as any;
                } else {
                    // Add access_token, refresh_token and expirations to the token right after signin
                    token.accessToken = account.access_token;
                    token.refreshToken = account.refresh_token;
                    token.accessTokenExpired = (account.expires_at as number) * 1000;
                    token.refreshTokenExpired = Date.now() + (account.refresh_expires_in as number) * 1000;
                    token.user = user;
                }
                setAxiosToken(<string>token.accessToken);

                const res = await requestAxios({
                    url: "/api/private/users/fr",
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });

                Object.assign(res?.data.data, {
                    medical_entity: res?.data.data.medical_entities?.find((entity: MedicalEntityDefault) =>
                        entity.is_default)?.medical_entity
                });
                token.data = res?.data.data;
                return token
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token as any).accessTokenExpired) {
                return token;
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        }
    },

    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {},

    // Enable debug messages in the console if you are having problems
    debug: !!process.env.DEBUG,
}

export default NextAuth(authOptions)

