const board = document.querySelector("#board");
let cells = ["","","","","","","","",""];
const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6] 
];

const player1 = "X";
const player2 = "O";
let gameMode = "2-player";
let difficultyLevel = "easy";
let curPlayer = player1;
document.getElementById("difficulty-container").style.display = "none";

function renderBoard(){
    board.innerHTML = "";
    for(let i = 0; i < cells.length; i++){
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.textContent = cells[i];
      cellElement.id = i;
      cellElement.addEventListener("click", function(){
          playerMove(i);
      });
      board.appendChild(cellElement);
    }
}

renderBoard();

function playerMove(i){
    if(cells[i]!== "") return;

    cells[i] = curPlayer;
    renderBoard();

    if(checkWin(curPlayer)){
      setTimeout(() => alert(`Player ${curPlayer} wins!`), 50);
      setTimeout((resetGame), 100);
      return;
    }

    if(checkTie(curPlayer)){
      setTimeout(() => alert(`Tie!`), 50);
      setTimeout((resetGame), 100);
      return;
    }

    curPlayer = curPlayer == player1 ? player2 : player1;


    if (gameMode === "against-computer" && curPlayer === player2) {
      setTimeout(computerMove(), 100) ;
    }
}

function checkWin(player){
  for(const[x, y, z] of winningCombos){
    if(cells[x] == player && cells[y] == player && cells[z] == player) return true;
  }

  return false;
}

function checkTie(){
  return !cells.includes("");
}

function resetGame(){
  cells = ["","","","","","","","",""];
  curPlayer = player1;
  renderBoard();
}

function changeMode() {
  gameMode = document.getElementById("mode").value;
  if (gameMode === "against-computer") {
    document.getElementById("difficulty-container").style.display = "block";
  } 
  else {
    document.getElementById("difficulty-container").style.display = "none";
  }
  resetGame();
}

function changeDifficulty() {
  difficultyLevel = document.getElementById("difficulty").value;
  resetGame();
}

function computerMove(){
  let index;
  if(difficultyLevel === "easy"){
      index = getRandomCellIndex();
  }
  else if(difficultyLevel === "hard"){
      index = move(cells);
  }
  cells[index] = curPlayer;
  if(index === null) return;
  renderBoard();

  if(checkWin(curPlayer)){
      setTimeout(() => alert(`Computer wins!`), 50);
      setTimeout((resetGame), 100);
      return;
  }

  if(checkTie(curPlayer)){
      setTimeout(() => alert(`Tie!`), 50);
      setTimeout((resetGame), 100);
      return;
  }

  curPlayer = curPlayer == player1 ? player2 : player1;
}

function getRandomCellIndex(){
  const emptyCells = [];

  for(let i = 0; i < cells.length; i++){       
    if(cells[i] === "") emptyCells.push(i);        
  }

  if(emptyCells.length){
      const index = Math.floor(Math.random() * emptyCells.length);
      return emptyCells[index];
  }

  return null;
}

function move(board) {
  var index = minimax(board, player2).index;
  return index;
}

function minimax(reboard, player) {
  let array = avail(reboard);
  if (checkWin(player1)) {
    return {
      score: -10
    };
  } else if (checkWin(player2)) {
    return {
      score: 10
    };
  } else if (array.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];
  for (var i = 0; i < array.length; i++) {
    var move = {};
    move.index = array[i];
    reboard[array[i]] = player;

    if (player == player2) {
      var g = minimax(reboard, player1);
      move.score = g.score;
    } else {
      var g = minimax(reboard, player2);
      move.score = g.score;
    }
    reboard[array[i]] = "";
    moves.push(move);
  }

  var bestMove;
  if (player === player2) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function avail(reboard) {
  let array = [];
  for(let i = 0; i < reboard.length; i++){
    if(reboard[i] === "") array.push(i);   
  }
  return array;
}