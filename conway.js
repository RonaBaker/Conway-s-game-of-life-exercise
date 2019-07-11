tableCreate();
let cellStacture = [];
let length = document.getElementsByTagName("td").length;
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetGame);
let rows = document.querySelector("table").getElementsByTagName("tr").length;
let columns = document.querySelector("table").querySelector("tr").getElementsByTagName("td").length;
let stopCountFlag;
let deadCellBackground = "rgb(" + 83 + "," + 83 + "," + 83 + ")";
init();

function tableCreate() {
        let frame = document.querySelector("#tableFrame");
        let tbl = document.createElement("table");
        for (let i = 0; i < 50; i++) { //create rows
                let tr = document.createElement("tr");
                for (let j = 0; j < 90; j++) { //create columns
                        let td = document.createElement("td");
                        tr.appendChild(td)
                }
                tbl.appendChild(tr);
        }
        frame.appendChild(tbl)
}

function init() {
        /* Initializing first game*/
        console.log("Initializing game");
        for (let i = 0; i < length; i++) {
                cellStacture[i] = {
                        isAlive: 0,
                        currentNeighbors: 0,
                        nextStep: 0,
                        element: null,
                        topNeighbor: i - columns,
                        bottomNeighbor: i + columns,
                        leftNeighbor: i - 1,
                        rightNeighbor: i + 1,
                        topRightNeighbor: i - columns + 1,
                        bottomRightNeighbor: i + columns + 1,
                        topLeftNeighbor: i - columns - 1,
                        bottomLeftNeighbor: i + columns - 1
                }
                cellStacture[i].element = document.getElementsByTagName("td")[i];
                cellStacture[i].element.myindex = i;
        }
        initElement();
}

function initElement() {
        for (let i = 0; i < length; i++) {
                cellStacture[i].element.addEventListener("click", checkLiveCell);
                cellStacture[i].element.style.backgroundColor = deadCellBackground;
        }
}

function initReset(){
        /* Initializing game after reset */
        for (let i = 0; i < length; i++){
                cellStacture[i].isAlive = 0;
                cellStacture[i].currentNeighbors = 0;
                cellStacture[i].nextStep = 0;
        }
        initElement();
}

function checkLiveCell(event) {
        /* upadte cell status: live = 1 , dead = 0 */
        let index = event.target.myindex; // Get clicked element index
        if (cellStacture[index].isAlive === 0) {
                cellStacture[index].element.style.background = "black";
                cellStacture[index].isAlive = 1;
                cellStacture[index].nextStep = 1;
        }
        else {
                cellStacture[index].element.style.background = deadCellBackground;
                cellStacture[index].isAlive = 0;
                cellStacture[index].nextStep = 0;
        }
}

function timedCount() {
        let cntNeighbors;
        let resetGameFlag = false;
        // Check for each cell if its alive or dead in the next step
        for (let cellNo = 0; cellNo < length; cellNo++) {
                cntNeighbors = countNeighbors(cellStacture[cellNo], cellNo); // Count Neighbors for each cell
                if (cellStacture[cellNo].isAlive === 1) { // Check live cell rules
                        if (cntNeighbors <= 1 || cntNeighbors > 3) {
                                cellStacture[cellNo].nextStep = 0;
                        }
                }
                else {   // Check dead cell rules
                        if (cntNeighbors === 3) {
                                cellStacture[cellNo].nextStep = 1;
                        }
                }
        }
        // Update current cell status according to nextStep
        for (let i = 0; i < length; i++) {
                cellStacture[i].isAlive = cellStacture[i].nextStep;
                if (cellStacture[i].isAlive === 1) {
                        cellStacture[i].element.style.background = "black";
                }
                else {
                        cellStacture[i].element.style.backgroundColor = deadCellBackground;
                }
        }

        // If all cells are dead start a new game automatically
        for (let i = 0; i < length; i++){
             if(cellStacture[i].isAlive === 1){
                     resetGameFlag = true;
                     break;
             }
        }
        if(!resetGameFlag){
                resetGame();
        }
        else{
                stopCountFlag = setTimeout(timedCount, 100); // Game loop
        }
}

function startGame() {
        if (startButton.innerHTML === "Start") {
                for (let i = 0; i < length; i++) {
                        cellStacture[i].element.removeEventListener("click", checkLiveCell); // remove event listener so the user cant choose cells in the middle of the game
                }
                startButton.innerHTML = "Pause";
                console.log("Starting game");
                timedCount(); // start game iteration
        }
        else if (startButton.innerHTML === "Pause") {
                startButton.innerHTML = "Start";
                console.log("Pausing game");
                clearTimeout(stopCountFlag); // Pause game iteration
        }
}

function resetGame() {
        startButton.innerHTML = "Start";
        clearTimeout(stopCountFlag);
        console.log("Starting a new game");
        initReset();
}

function countNeighbors(cell, index) {
        let cnt = 0;
        [type, num] = cornerCheck(cell, index); // checking corners
        if(type){
                return num;
        }
        [type, num] = frameCheck(cell, index); // Checking frame
        if(type){
                return num;
        }
        // Any cell which doesn't meet the above requirements
        if (cellStacture[cell.topNeighbor].isAlive === 1) {
                cnt++;
        }
        if (cellStacture[cell.bottomNeighbor].isAlive === 1) {
                cnt++;
        }
        if (cellStacture[cell.leftNeighbor].isAlive === 1) {
                cnt++;
        }
        if (cellStacture[cell.topLeftNeighbor].isAlive === 1) {
                cnt++;
        }
        if (cellStacture[cell.bottomLeftNeighbor].isAlive === 1) {
                cnt++;
        }
        if (cellStacture[cell.rightNeighbor].isAlive === 1) {
                cnt++;
        }
        if (cellStacture[cell.topRightNeighbor].isAlive === 1) {
                cnt++;
        }
        if (cellStacture[cell.bottomRightNeighbor].isAlive === 1) {
                cnt++;
        }
        return cnt;
}
function cornerCheck(cell, index){
        let cnt = 0;
        if (index === 0) {
                if (cellStacture[cell.rightNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomRightNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomNeighbor].isAlive === 1) {
                        cnt++;
                }
                return [true, cnt];
        }
        else if (index === (columns - 1)) {
                if (cellStacture[cell.leftNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomLeftNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomNeighbor].isAlive === 1) {
                        cnt++;
                }
                return [true, cnt];
        }
        else if (index === (columns * (rows - 1))) {
                if (cellStacture[cell.topNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.topRightNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.rightNeighbor].isAlive === 1) {
                        cnt++;
                }
                return [true, cnt];
        }
        else if (index === ((rows * columns) - 1)) {
                if (cellStacture[cell.topNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.topLeftNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.leftNeighbor].isAlive === 1) {
                        cnt++;
                }
                return [true, cnt];
        }
        return [false, cnt];
}

function frameCheck(cell, index){
        let cnt = 0;
        if ((index - columns) < 0 ) { // Top row
                if (cellStacture[cell.bottomNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.leftNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.rightNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomLeftNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomRightNeighbor].isAlive === 1) {
                        cnt++;
                }
                return [true, cnt];
        }
        else if ((index + columns) > (columns * rows)) { // Bottom row
                if (cellStacture[cell.topNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.leftNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.rightNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.topLeftNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.topRightNeighbor].isAlive === 1) {
                        cnt++;
                }
                return [true, cnt];
        }
        else if (index % columns === 0) { // Left column
                if (cellStacture[cell.topNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.rightNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.topRightNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomRightNeighbor].isAlive === 1) {
                        cnt++;
                }
                return [true, cnt];
        }
        else if ((index + 1) % columns === 0) { // Right column
                if (cellStacture[cell.topNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.leftNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.topLeftNeighbor].isAlive === 1) {
                        cnt++;
                }
                if (cellStacture[cell.bottomLeftNeighbor].isAlive === 1) {
                        cnt++;
                }
                return [true, cnt];
        }
        return [false, cnt];
}