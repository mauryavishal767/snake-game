// // Define Html elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const gameOverText = document.getElementById('loose-text')
const scoreText = document.getElementById('scored');
const resetButton = document.getElementById('restart');
let highScoreText = document.getElementById('highScore');

// //define  game variables
const gridSize = 20;
let snake = [{x:10, y:10}]
let food = generateFood();
let highScore = localStorage.getItem("highScore") && localStorage.getItem("highScore");
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

//set high score if present in local storage
if(localStorage.getItem('highScore')){
    highScore = localStorage.getItem("highScore");
    highScoreText.textContent = highScore;
}

//draw game map, snake, food
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//draw snake
function drawSnake(){
    if(gameStarted){
        snake.forEach((segment) => {
            const snakeElement = createGameElement('div', 'snake');
            setPosition(snakeElement, segment);
            board.appendChild(snakeElement);
        })
    }
}

//create a snakee or food cube/div
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//set the position of snake or food
function setPosition(element, position){
    element.style.gridColumn = position.x; 
    element.style.gridRow = position.y; 
}

// draw food function
function drawFood(){
    if(gameStarted){
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// generate food
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}


// prepare interview question why you spred for head insted of directly taking 0 potion 
//clearInterval use

//snake move
function move(){
    const head = {...snake[0]};
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
    }

    snake.unshift(head); // insert head in front of array
    if(head.x === food.x && head.y === food.y){
        // gameSpeedDelay += 50;
        food = generateFood();
        clearInterval(gameInterval); // clear past interval
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay)
    } else {
        snake.pop();
    }
}

// start game function
function startGame(){
    gameStarted = true;
    gameOverText.style.display = 'none';
    scoreText.style.display = 'none';
    resetButton.style.display = 'none';
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    if(localStorage.getItem('highScore')){
        highScore = localStorage.getItem("highScore");
        highScoreText.textContent = highScore;
    }

    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//keypress event listener
document.addEventListener('keydown', handleKeyPress);
function handleKeyPress(event) {
    if(
        (!gameStarted && event.code === 'space') ||
        (!gameStarted && event.key === ' ')
    ){
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
            break;
        }
    }
}


// auto increase speed, snake split, goes out of map; 
// clearInterval() ==> clearInterval(gameInterval)

//why you are not using spread as erlier
function checkCollision(){
    const head = snake[0];
    if(
        head.x < 1 || 
        head.x > gridSize ||
        head.y < 1 ||
        head.y > gridSize
    ) {
        resetGame();
    }

    for(let i = 1; i< snake.length; i++){
        if(
            head.x === snake[i].x && 
            head.y === snake[i].y
        ) {
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10,y:10}];
    food = generateFood();
    direction = 'right';
    updateScore();
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');//convert into 3 digit num
}

function stopGame(){
    scoreText.innerHTML = `Score: ${snake.length-1}`;
    clearInterval(gameInterval);
    gameStarted = false;
    gameOverText.style.display = 'block';
    scoreText.style.display = 'block';
    resetButton.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length -1;
    if(currentScore > highScore){
        highScore = currentScore;
        const highScoreString = highScore.toString().padStart(3,'0');
        highScoreText.textContent = highScoreString;
        localStorage.setItem("highScore", highScoreString);
        // highScoreText.style.display = 'block';
    }
}


// when game restart food still apear
// ==> draw function into wrap if game started, it will stop at collision

// ==> wrap draw food insted, brings to start nothing show 
// todo: check if snake is under the image

resetButton.addEventListener("click", (e)=>{startGame()});