import firebase from 'firebase';
import firestore from 'firebase'

const settings = {timestampsInSnapshots: true};

const config = {
    // Your Credentials
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
