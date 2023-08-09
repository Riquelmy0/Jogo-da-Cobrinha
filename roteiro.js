const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// part gameOver 
const score = document.querySelector('.score--Value');
const FinalScore = document.querySelector('.final-score > span');
const menuScreen = document.querySelector('.menu-screen');
const buttonReplay = document.querySelector('.btn-play')

//button mobile
const up = document.querySelector('.up');
const right = document.querySelector('.right');
const left = document.querySelector('.left');
const down = document.querySelector('.down');


//audios:
const audio = new Audio('./assets/assets_audio.mp3');
const EndGameSound = new Audio("./assets/negative_beeps-6008.mp3");
let valorSound = false;
const soundClickButton = new Audio('./assets/shooting-sound-fx-159024.mp3');
const { duration } = soundClickButton;



const size = 30;

let snake = [
    { x: 270, y: 240 },
    { x: 300, y: 240 },
]

const incrementScore = () => {
    score.innerHTML = parseInt(score.innerHTML) + 1
}


const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

const randomColor = () => {

    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

const drawFood = () => {
    const { x, y, color } = food; //objeto desestruturado;


    ctx.shadowColor = color; // sombra da comida;
    ctx.shadowBlur = 10; // tamanho da sombra;
    ctx.fillStyle = color; // fillstyle define a cor do canvas;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
}

const drawSnake = () => {  //01- nessa function temos a criação de cada bloco e seus respectivos tamanhos
    ctx.fillStyle = '#DDD';



    snake.map(({ x, y }, index) => {

        if (index == snake.length - 1) {
            ctx.fillStyle = 'white';
        }

        return ctx.fillRect(x, y, size, size);
    })
}

const moveSnake = () => { //02- funtion que é responsável por mover a cobrinha;
    if (!direction) return // se não tiver nada dentro de direction, pula pro final;

    const head = snake[snake.length - 1];

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

const dralGrid = () => { //04- desenhando o grid;
    ctx.lineWidth = 1 // largura da linha;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();

        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke()

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke()
    }

}

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        snake.push(head);

        audio.play();
        incrementScore();

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();

    }

}

const checkColidion = () => {

    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2

    const wallColision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfColision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })



    if (wallColision || selfColision) {
        gameOver();
    }
}


const gameOver = () => {
    direction = undefined;

    menuScreen.style.display = 'flex';
    FinalScore.innerHTML = score.innerHTML;
    canvas.style.filter = "blur(4px)";
    sound();
}

const sound = () => {  // function verificar se valorSound é false, se for, então executa;

    if (!valorSound) {
        EndGameSound.play();
        valorSound = true;
    }
}


const gameLoop = () => { //03- function que será responsável por fazer o jogo rodar;
    clearInterval(loopId);

    ctx.clearRect(0, 0, 600, 600); //limpa o canvas a cada iteração;
    dralGrid() // loop do grid;
    drawFood()// function da comida;
    moveSnake() // movimentação da cobrinha;
    drawSnake() //passa valores de x, y , w , h;
    checkEat()
    checkColidion()

    loopId = setTimeout(() => {
        gameLoop()
    }, 200); // velocidade do game;

}

gameLoop()


//criando evento de teclado:::

document.addEventListener("keydown", ({ key }) => { // aqui estamos definindo a move da snake, usando o evento para recuperar
    console.log(key);
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
        soundClickButton.play();

    }
    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
        soundClickButton.play();

    }
    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
        soundClickButton.play();

    }
    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
        soundClickButton.play();

    }
})


//button parte responsiva:
right.addEventListener("click", (event) => {
    if (event.detail == 1 && direction != "left") {
        direction = "right"
        soundClickButton.play();
    }
})
left.addEventListener("click", (event) => {

    if (event.detail == 1 && direction != "right") {
        direction = "left"
        soundClickButton.play();

    }
})
up.addEventListener("click", (event) => {
    if (event.detail == 1 && direction != "down") {
        direction = "up"
        soundClickButton.play();

    }
})
down.addEventListener("click", (event) => {
    if (event.detail == 1 && direction != "up") {
        direction = "down"
        soundClickButton.play();
    }
})



buttonReplay.addEventListener('click', () => {

    score.innerHTML = "00";
    menuScreen.style.display = "none";
    canvas.style.filter = "none";

    snake = [{ x: 270, y: 240 }, { x: 300, y: 240 },];
    valorSound = false;

})
