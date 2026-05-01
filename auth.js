// FIREBASE IMPORTS
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
getAuth,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔑 CONFIG
const firebaseConfig = {
apiKey: "AIzaSyAofirNVMReXq1mrdGFXUaf4qxjjVU4mE4",
authDomain: "matescraft-a441d.firebaseapp.com",
projectId: "matescraft-a441d",
storageBucket: "matescraft-a441d.firebasestorage.app",
messagingSenderId: "878330126314",
appId: "1:878330126314:web:278c942ab5a89dfc0a5c93"
};

// INIT
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ============================
// 🔐 AUTH CHECK (FIXED)
// ============================

let checkedAuth = false;

onAuthStateChanged(auth, async (user) => {

// wait once
if (checkedAuth) return;
checkedAuth = true;

// ⏳ SMALL DELAY (CRITICAL FIX)
setTimeout(async () => {

```
// ❌ NOT LOGGED IN
if (!user) {
  if (!window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
  }
  return;
}

// ✅ LOGGED IN
const userRef = doc(db, "players", user.uid);
const snap = await getDoc(userRef);

// 🎮 CHECK IGN
if (!snap.exists() || !snap.data().ign) {
  const box = document.getElementById("ignBox");
  if (box) box.style.display = "block";
}
```

}, 300); // 🔥 delay prevents breaking page

});

// ============================
// 💾 SAVE IGN
// ============================

window.saveIGN = async function(){

const ignInput = document.getElementById("ignInput");

if (!ignInput) return;

const ign = ignInput.value.trim();

if (ign === "") {
alert("Enter Minecraft Username");
return;
}

const user = auth.currentUser;
const userRef = doc(db, "players", user.uid);

await setDoc(userRef, { ign: ign }, { merge: true });

document.getElementById("ignBox").style.display = "none";

alert("IGN Saved Successfully!");
};

// ============================
// 🚪 LOGOUT
// ============================

window.logout = async function(){
await signOut(auth);
window.location.href = "login.html";
};
