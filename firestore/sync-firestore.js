'use strict';

// [START firestore_sync]
const {initializeApp, applicationDefault, cert} = require('firebase-admin/app');
const {getFirestore, Timestamp, FieldValue, Filter} = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
    credential: cert(serviceAccount)
});

const firestore = getFirestore();

function traverseObject(obj, document, path = '') {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            traverseObject(obj[key], path + '.' + key); // Update the path for nested objects
        } else {
            console.log(`Parent: ${path}, Key: ${key}, Value: ${obj[key]}`);
        }
    }
}

async function syncFirestore() {
    const localesDir = "../public/locales"
    fs.rm(`${localesDir}/.DS_Store`, {recursive: true, force: true}, err => {
        if (err) {
            throw err;
        }
        console.log(`${localesDir}/.DS_Store is deleted!`);
    });
    fs.readdir(`${localesDir}`, (err, langDir) => {
        if (err) throw err;
        langDir.forEach(lang => {
            fs.readdir(`${localesDir}/${lang}`, (err, files) => {
                if (err) throw err;
                fs.rm(`${localesDir}/${lang}/.DS_Store`, {recursive: true, force: true}, err => {
                    if (err) {
                        throw err;
                    }
                    console.log(`${localesDir}/${lang}/.DS_Store is deleted!`);
                });
                files.filter(file => file !== ".DS_Store").forEach(async file => {
                    const filePath = path.join(`${localesDir}/${lang}`, file);
                    console.log("file", file.replace(".json", `-${lang}`), filePath);
                    const contents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    // Obtain a document reference.
                    const document = firestore.doc(`i18next/${file.replace(".json", `-${lang}`)}`);
                    // Enter new data into the document.
                    await document.set({
                        locales: lang,
                        ns: file.replace(".json", ""),
                        data: contents
                    });
                });
            });
        })
    });
}

syncFirestore();
// [END firestore_sync]
