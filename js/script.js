const BOARD_WIDTH = 5;
const BOARD_HEIGHT = 6;
const gameBoard = document.querySelector("#game-board");
const timePerStep = 400;
let moveDirection;
let snake, foodLocation;
let isGameOver = false;
let hasChangedDirection;
let gameTimeout;
let snakeLength;

createGameBoard();
changeMoveDirection();
moveSnake();

function createGameBoard() {
    gameBoard.innerHTML = "";
    gameBoard.style.display = "grid";
    gameBoard.style.flexDirection = "";
    gameBoard.style.alignItems = "";
    gameBoard.style.justifyContent = "";
    gameBoard.style.height = "100%";
    gameBoard.style.width = "100%";
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, auto)`;
    gameBoard.style.gridTemplateRows = `repeat(${BOARD_HEIGHT}, auto)`;

    let width = parseFloat(gameBoard.offsetWidth)/BOARD_WIDTH;
    let height = parseFloat(gameBoard.offsetHeight)/BOARD_HEIGHT;
    let size = Math.min(width, height);
    gameBoard.style.height = size*BOARD_HEIGHT+"px";
    gameBoard.style.width = size*BOARD_WIDTH+"px";

    for (let i=0; i<BOARD_HEIGHT; i++) {
        for (let j=0; j<BOARD_WIDTH; j++) {
            let gameSquare = document.createElement("div");
            gameSquare.classList.add("game-square");
            gameSquare.setAttribute("id", `${i} ${j}`);
            gameBoard.append(gameSquare);
        }
    }
    hasChangedDirection = false;

    snake = [[5, 0], [5, 1], [5, 2]];
    snake.forEach((block) => {
        document.getElementById(`${block[0]} ${block[1]}`).style.backgroundColor = "black";
    })
    snakeLength = snake.length;
    generateNewFood();
    moveDirection = "right";
}

function changeMoveDirection() {
    document.addEventListener("keydown", (key) => {
        if (hasChangedDirection) {
            return;
        }
        if (key.code=="ArrowLeft" && moveDirection!="right") {
            moveDirection = "left";
            hasChangedDirection = true;
        }
        if (key.code=="ArrowRight" && moveDirection!="left") {
            moveDirection = "right";
            hasChangedDirection = true;
        }
        if (key.code=="ArrowDown" && moveDirection!="up") {
            moveDirection = "down";
            hasChangedDirection = true;
        }
        if (key.code=="ArrowUp" && moveDirection!="down") {
            moveDirection = "up";
            hasChangedDirection = true;
        }
    })
}

function snakeHasBlock(block) {
    for (let i=0; i<snake.length; i++) {
        if (block[0]==snake[i][0] && block[1]==snake[i][1]) {
            return true;
        }
    }
    return false;
}

function moveSnakeStep() {
    let head = snake[snake.length-1];
    let prev = snake[snake.length-2];
    let lastBlock = document.getElementById(`${snake[0][0]} ${snake[0][1]}`);
    hasChangedDirection = false;

    if (moveDirection=="up" && head[0]>0 && 
        prev[0]!=head[0]-1 && !snakeHasBlock([head[0]-1,head[1]])) {
        snake.push([head[0]-1, head[1]]);
        document.getElementById(`${head[0]-1} ${head[1]}`).style.backgroundColor = "black";
        if (head[0]-1!=foodLocation[0] || head[1]!=foodLocation[1]) {
            lastBlock.style.backgroundColor = "";
            snake.shift();
        } else {
            snakeLength++;
            generateNewFood();
        }
    } else if (moveDirection=="down" && head[0]<BOARD_HEIGHT-1 && 
        prev[0]!=head[0]+1 && !snakeHasBlock([head[0]+1,head[1]])) {
        snake.push([head[0]+1, head[1]]);
        document.getElementById(`${head[0]+1} ${head[1]}`).style.backgroundColor = "black";
        if (head[0]+1!=foodLocation[0] || head[1]!=foodLocation[1]) {
            lastBlock.style.backgroundColor = "";
            snake.shift();
        } else {
            snakeLength++;
            generateNewFood();
        }
    } else if (moveDirection=="left" && head[1]>0 && 
        prev[1]!=head[1]-1 && !snakeHasBlock([head[0],head[1]-1])) {
        snake.push([head[0], head[1]-1]);
        document.getElementById(`${head[0]} ${head[1]-1}`).style.backgroundColor = "black";
        if (head[0]!=foodLocation[0] || head[1]-1!=foodLocation[1]) {
            lastBlock.style.backgroundColor = "";
            snake.shift();
        } else {
            snakeLength++;
            generateNewFood();
        }
    } else if (moveDirection=="right" && head[1]<BOARD_WIDTH-1 && 
        prev[1]!=head[1]+1 && !snakeHasBlock([head[0],head[1]+1])) {
        snake.push([head[0], head[1]+1]);
        document.getElementById(`${head[0]} ${head[1]+1}`).style.backgroundColor = "black";
        if (head[0]!=foodLocation[0] || head[1]+1!=foodLocation[1]) {
            lastBlock.style.backgroundColor = "";
            snake.shift();
        } else {
            snakeLength++;
            generateNewFood();
        }
    } else {
        isGameOver = true;
    }
    console.log(snakeLength);
}

function generateNewFood() {
    let rowFood, colFood;
    while(true) {
        if (snakeLength==BOARD_HEIGHT*BOARD_WIDTH) {
            return;
        }
        rowFood = Math.floor(BOARD_HEIGHT*Math.random());
        colFood = Math.floor(BOARD_WIDTH*Math.random());
        if (!snakeHasBlock([rowFood, colFood])) {
            foodLocation = [rowFood, colFood];
            document.getElementById(`${rowFood} ${colFood}`).style.backgroundColor = "red";
            return;
        }
    }
}

function showGameOver() {
    gameBoard.style.display = "flex";
    gameBoard.style.gridTemplateColumns = "";
    gameBoard.style.gridTemplateRows = "";
    gameBoard.style.flexDirection = "column";
    gameBoard.style.alignItems = "center";
    gameBoard.style.justifyContent = "center";
    
    if (snakeLength == BOARD_HEIGHT*BOARD_WIDTH) {
        gameBoard.innerHTML = `<h1>Congratulations! You won!</h1>`;
    } else {
        gameBoard.innerHTML = `<h1>Game Over</h1><p>Final length: ${snakeLength}<p>`;
    }
    const buttonPlayAgain = document.createElement("button");
    buttonPlayAgain.innerText = "Play Again";
    buttonPlayAgain.addEventListener("click", () => {
        createGameBoard();
        moveSnake();

    });
    gameBoard.append(buttonPlayAgain);
}

function moveSnake() {
    if (isGameOver) {
        isGameOver = false;
        clearTimeout(gameTimeout);
        showGameOver();
        return;
    }
    if (snakeLength==BOARD_HEIGHT*BOARD_WIDTH) {
        isGameOver = false;
        clearTimeout(gameTimeout);
        showGameOver();
        return;
    }
    moveSnakeStep();
    gameTimeout = setTimeout(moveSnake, timePerStep);
}