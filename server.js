const express = require("express");
const app = express();
app.use(express.json());

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json"))
});

const db = admin.firestore();

app.post("/update", async (req, res) => {
  const { ign, kills } = req.body;

  const snapshot = await db.collection("players").get();

  snapshot.forEach(async (doc) => {
    const data = doc.data();

    if (data.ign === ign) {
      await db.collection("players").doc(doc.id).update({
        kills: (data.kills || 0) + kills
      });
    }
  });

  res.send("Updated");
});

app.listen(3000, () => console.log("Server running"));