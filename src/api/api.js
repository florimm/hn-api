import firebase from 'firebase';

firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com/',
});

export default firebase.database().ref('/v0');
