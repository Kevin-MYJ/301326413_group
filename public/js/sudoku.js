
function makeRow(v=0){
    const array = new Array(9);
    array.fill(v);
    return array
}

function makeMatrix(v=0) {
    return Array.from({length:9}, ()=>makeRow(v));
}

/** 
 * 把行坐标和列坐标 转变为 宮位置和宫内格序号
 **/
function convertXY2board(row, col){
    const boardIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    const eleIndex = row % 3 * 3 + col % 3;
    return [boardIndex, eleIndex];
}

/**
 * 把宮位置和宫内格序号 转变为 行坐标和列坐标
 **/
function convertboard2XY(boardIndex, eleIndex) {
    const row = Math.floor(boardIndex / 3) * 3 + Math.floor(eleIndex / 3);
    const col = boardIndex % 3 * 3 + eleIndex % 3;
    return [row, col];
}

function randomScramb(array) {
    const arrLen = array.length;
    const endIndex = arrLen - 2;
    for (let i = 0; i <=endIndex; i++) {
        const element = Math.floor(Math.random()*(arrLen-i));
        if (array[i]===array[element]) {
            continue;
        }
        [array[i], array[element]] =   [array[element], array[i]];
    }
    return array;
}

/**
 *Get the value of each grid in the current board, boardIndex is the index of value that in which board
 * 获取当前宮内每一格的值
 *return a array that store all value in one board  
**/
function getBoardValue(matrix, boardIndex) {
    const startRow = Math.floor(boardIndex/3)*3;
    const startCol = boardIndex % 3 * 3;
    const result = [];

    for (let i = 0; i < 9; i++) {
        const row = startRow + Math.floor(i/3);
        const col = startCol + i%3;
        result.push(matrix[row][col]);
    }
    return result;
}

/**
 * Check whether the specified position can fill in this number n
 * 检查指定位置是否可以填写这个数字n
 **/
function checkFillNum(matrix, n, row, col) {
    //The row of the location
    const rowArr = matrix[row];
    //The column of the location
    const colArr = [];
    for (let i = 0; i < 9; i++) {
        colArr.push(matrix[i][col]);
    }
    //The board of the location
    const boardIndex = convertXY2board(row,col)[0];
    const boardArr = getBoardValue(matrix,boardIndex);

    if (rowArr.indexOf(n) !== -1 || colArr.indexOf(n) !== -1 || boardArr.indexOf(n) !== -1 ) {
        return false;
    }
    return true;
}

/**
 * 生成数独游戏 
 **/
class Generator{
    constructor(matrix){
        this.matrix = matrix;
    }
    generator(){
        while (true) {
            if(this.generation() === true){
                break;
            }
        }
    }
    generation(){
        this.order = makeMatrix()
                .map(row=>row.map((v,i)=>i))
                .map(row=>randomScramb(row));
        
        for (let n = 1; n <=9; n++) {
            if(this.fillNum(n) === false){
                return false;
            }
        }
        return true;
    }
    fillNum(n){
        return this.fill(n,0);
    }
    fill(n, row){
        if(row > 8){
            return true;
        }
        const rowArr = this.matrix[row];
        const orders = this.order[row];

        for (let i = 0; i < 9; i++) {
            const col = orders[i];
            if (rowArr[col] !== 0) {
                continue;
            }
            if (checkFillNum(this.matrix, n, row, col) === false) {
                continue;
            }
            rowArr[col] = n;

            if(this.fill(n, row+1)===false){
                const prevRow = row;
                const prevCol = col;
                this.matrix[prevRow][prevCol] = 0;
                continue;
            }
            return true;
        }
        return false;
    }
}

/**
 * 生成空位置，返回用户需要填写的位置的array 
 **/
function hollowOut(difficult) {
    const questionArr = new Array();
    while(questionArr.length < difficult){
        let position = Math.floor(Math.random()*81);
        if (questionArr.indexOf(position) === -1) {
            questionArr.push(position);
        }
    }
    return questionArr.sort((a,b)=> a - b);
}

/**
 * 在html显示数字，如果该位置是问题中的一个，就不显示 
 **/
function showInBoard(matrix, questionArr) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let position = i * 9 + j;
            if (questionArr.indexOf(position) !== -1) {
                let label = "#"+position;
                $(label).addClass("Unknown");
                continue;
            }
            let label = ""+position;
            document.getElementById(label).innerHTML = matrix[i][j];
            // user[i][j] = matrix[i][j];
        }
    }
}
// Create a sudoku board
function createGrid(parentId, tableNum, idArray){
    let table1 = document.createElement("table");
    let tableClass = "Board " + tableNum;
    table1.setAttribute("class", tableClass);
    parentId.appendChild(table1);

    let temp1 = document.createElement("tr");
    table1.appendChild(temp1);
    for (let i = 0; i < 9; i++) {
        if (i%3 == 0 && i!=0) {
            temp1 = document.createElement("tr");
            table1.appendChild(temp1);
        }
        let tdElement = document.createElement("td");
        tdElement.setAttribute("class", "BoardElement");
        temp1.appendChild(tdElement);

        let divElement = document.createElement("div");
        let divId = ""+idArray[i];
        divElement.setAttribute("id",divId);
        divElement.setAttribute("class", "Cell");
        tdElement.appendChild(divElement);
    }
}

function createBoard() {
    let board = document.createElement("table");
    board.setAttribute("id", "gameBoard");
    document.getElementById("gameBody").appendChild(board);

    // Group 1,2,3
    let tableTr123 = document.createElement("tr");
    board.appendChild(tableTr123);
    // let group1 = document.createElement("td");
    // let group2 = document.createElement("td");
    // let group3 = document.createElement("td");
    // tableTr123.appendChild(group1);
    // tableTr123.appendChild(group2);
    // tableTr123.appendChild(group3);
    createGrid(tableTr123, 1, [0,1,2,9,10,11,18,19,20]);
    createGrid(tableTr123, 4, [27,28,29,36,37,38,45,46,47]);
    createGrid(tableTr123, 7, [54,55,56,63,64,65,72,73,74]);

    // Group 4,5,6
    let tableTr456 = document.createElement("tr");
    board.appendChild(tableTr456);
    // let group4 = document.createElement("td");
    // let group5 = document.createElement("td");
    // let group6 = document.createElement("td");
    // tableTr456.appendChild(group4);
    // tableTr456.appendChild(group5);
    // tableTr456.appendChild(group6);
    createGrid(tableTr456, 2, [3,4,5,12,13,14,21,22,23]);
    createGrid(tableTr456, 5, [30,31,32,39,40,41,48,49,50]);
    createGrid(tableTr456, 8, [57,58,59,66,67,68,75,76,77]);

    //Group 7,8,9
    let tableTr789 = document.createElement("tr");
    board.appendChild(tableTr789);
    // let group7 = document.createElement("td");
    // let group8 = document.createElement("td");
    // let group9 = document.createElement("td");
    // tableTr789.appendChild(group7);
    // tableTr789.appendChild(group8);
    // tableTr789.appendChild(group9);
    createGrid(tableTr789, 3, [6,7,8,15,16,17,24,25,26]);
    createGrid(tableTr789, 6, [33,34,35,42,43,44,51,52,53]);
    createGrid(tableTr789, 9, [60,61,62,69,70,71,78,79,80]);
}
///////////////////////////////

function Gaming() {
    document.getElementById("startButton").style.display = "none";
    document.getElementById("body2").style.display = "inline-block";
    document.getElementById("select-row").style.display = "flex";

    createBoard();
    var matrix = makeMatrix();
    const sudo = new Generator(matrix);
    sudo.generator();
    // console.log(sudo.matrix);

    var solution = sudo.matrix;
    console.log("solution matrix:", solution);

    const difficult = 45;
    var questionArr = hollowOut(difficult);
    var trueInput = 0;
    var falseInput = 0;
    console.log("unknown id :", questionArr);
    console.log("True Input : ", trueInput);
    console.log("False Input : ", falseInput);

    showInBoard(solution, questionArr);

    $("#gameBody").on('click', '.Unknown', function(e){
        if($(e.target).html() == ""){
            $(".Unknown").removeClass("selected");
            $(e.target).addClass("selected");
        }
    });

    $("div.select-row, .select-input").on("click", function (e) {
        let select = parseInt($(".selected").attr("id"));
        console.log("select position is: ", select);
        let inputValue = parseInt($(e.target).html());
        console.log("input value:", inputValue);
        let row = parseInt(parseInt(select) / 9);
        let col = parseInt(parseInt(select) % 9);
        if(solution[row][col] == inputValue){
            console.log("True : " + solution[row][col] + " == " + inputValue);
            $("#" + select).removeClass("Unknown");
            $("#" + select).removeClass("selected");
            $("#" + select).html(inputValue);
        }else{
            console.log("False : " + solution[row][col] + " != " + inputValue);
        }
    });
    // $("div.select-input").on("click", function (e) {
    //     let i = parseInt($(e.target).html());
    //     console.log("delete number:", i);
    //     console.log("delete index:", test.indexOf(i));
    //     console.log("delete value:", test[test.indexOf(i)])
    //     test.splice(test.indexOf(i),1);
    //     console.log("test is ", test);
    // });
    // console.log("out of click:", test);
}


// var test = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// $("div.select-input").on("click", function (e) {
//     let i = parseInt($(e.target).html());
//     console.log("delete number:", i);
//     console.log("delete index:", test.indexOf(i));
//     console.log("delete value:", test[test.indexOf(i)]);
//     test.splice(test.indexOf(i), 1);
//     console.log("test is ", test);
//     if (test.length < 6) {
//       console.log("Stop");
//       $("div.select-input").off("click");
//     }
// });