import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://playground-dc4c5-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

const endorsementsTextEl = document.getElementById("endorsements-text");
const endorsementsFromEl = document.getElementById("endorsements-from");
const endorsementsToEl = document.getElementById("endorsements-to");
const mainEl = document.getElementById("main-el");
const endorsementsContainerEl = document.getElementById("endorsements-container");

mainEl.addEventListener("submit", publish);

onValue(endorsementsInDB, function(snapshot) {
    if(snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearEndorsementsContainerEl();

        itemsArray.map((currentColl) => appendCollToContainer(currentColl));
    } else {
        endorsementsContainerEl.innerHTML = "No messages...yet"
    }
});

function publish(a) {
    a.preventDefault();
    
    let textElValue = endorsementsTextEl.value;
    let fromElValue = endorsementsFromEl.value;
    let toElValue = endorsementsToEl.value;
    
    let divData = [textElValue, fromElValue, toElValue];
    
    push(endorsementsInDB, divData);
    
    clearInputField();
};

function appendCollToContainer(coll) {
    let divID = coll[0];
    let textValue = coll[1][0];
    let fromValue = coll[1][1];
    let toValue = coll[1][2];
    
    let newDiv = document.createElement("div");
    
    newDiv.innerHTML = `
    <h3>To ${toValue}</h3>
    <p>${textValue}</p>
    <h3>From ${fromValue}</h3>
    `;
    
    newDiv.addEventListener("dblclick", function() {
        let exactLocationOfDivEl = ref(database, `endorsements/${divID}`);
        
        remove(exactLocationOfDivEl);
    })
    
    endorsementsContainerEl.append(newDiv);
};

function clearEndorsementsContainerEl() {
    endorsementsContainerEl.innerHTML = "";
};

function clearInputField() {
    endorsementsTextEl.value = '';
    endorsementsFromEl.value = '';
    endorsementsToEl.value = '';
};
