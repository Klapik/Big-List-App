import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';

admin.initializeApp();

// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
//const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;
const ALGOLIA_INDEX_NAME = 'documents';

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

// Add document to Algolia
exports.indexDocument = functions.firestore
    .document('documents/{documentId}')
    .onCreate((snap, context) => {
        const data = snap.data();
        const objectID = snap.id;

        const body = {
            email: data.email,
            fullname: data.fullname,
            name: data.name,
            surname: data.surname,
            integer: data.integer,
        }
        // Add the data to the algolia index
        return index.addObject({
            objectID,
            ...body
        });
    });

// Remove document from algolia
exports.unindexDocument = functions.firestore
    .document('documents/{documentId}')
    .onDelete((snap, context) => {
        const objectId = snap.id;

        // Delete an ID from the index
        return index.deleteObject(objectId);
    });