import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  projectId: "mock-exams-site",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkExams() {
  const examsCol = collection(db, "exams");
  const snapshot = await getDocs(examsCol);
  
  console.log(`Found ${snapshot.docs.length} exams.`);
  snapshot.docs.forEach(doc => {
    console.log(`ID: ${doc.id}, Data:`, JSON.stringify(doc.data()));
  });
}

checkExams();
