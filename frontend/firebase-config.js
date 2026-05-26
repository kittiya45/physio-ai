// ─── Firebase Configuration ──────────────────────────────────────────────────
// !! สำคัญ: เปลี่ยนค่าด้านล่างให้ตรงกับ Firebase Project ของคุณ !!
// วิธีหา config: Firebase Console → Project Settings → Your apps → Config

const firebaseConfig = {
  apiKey: "AIzaSyCYgzyzU-9Z_ixVJV7293GsHBxcIFk--Go",
  authDomain: "englishgame-trfnls.firebaseapp.com",
  projectId: "englishgame-trfnls",
  storageBucket: "englishgame-trfnls.firebasestorage.app",
  messagingSenderId: "962187341824",
  appId: "1:962187341824:web:956210586a0d9b5e7ce8e5"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

function requireAuth() {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            if (user) {
                resolve(user);
            } else {
                window.location.href = 'login.html';
                reject(new Error('Not authenticated'));
            }
        });
    });
}

async function getUserProfile(uid) {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
}

async function saveSession(sessionData) {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const profile = await getUserProfile(user.uid);
    const now = new Date();

    return db.collection('sessions').add({
        userId: user.uid,
        email: user.email,
        userName: profile ? `${profile.firstName} ${profile.lastName}` : user.email,
        age: profile ? profile.age : '',
        gender: profile ? profile.gender : '',
        condition: profile ? profile.condition : '',
        date: now.toLocaleDateString('th-TH'),
        time: now.toLocaleTimeString('th-TH'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        ...sessionData
    });
}
