
# [Firestore: Synchronizing locales data]

### Support storing and retrieving i18next translations from Firestore

### Backend Options

```ts
{
  // if you use i18next-localstorage-backend as caching layer in combination with i18next-chained-backend, you can optionally set an expiration time
  // expirationTime: 60 * 60 * 1000
  firestore: firestore, // pass the firestore instance to the backend plugin
  // Firestore DB field name
  collectionName: "i18next",
  languageFieldName: "locales",
  namespaceFieldName: "ns",
  dataFieldName: "data",
  debug: isDev, // debug mode
  // pass the firestore functions to the backend plugin          
  firestoreModule: {
    isModular: true,
    functions: {
        collection,
                query,
                where,
                getDocs
      },
  }
}
```
### Example of the firestore document that will be created:

```ts
{
  "locales": "en",
  "ns": "agenda",
  "data": {
    "key": "Thank you!"
  }
}
```

### Quickstart

`npm run sync`

