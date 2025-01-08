document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("game");
    const playerBoat = document.getElementById("playerBoat");
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");
    const startButton = document.getElementById("start");

    const lanes = [0, 200, 400, 600];
    let playerLane = 0;
    let hurdleInterval;
    let gameRunning = false;
    let gameStartTime; 

    const hurdleImages = [
        './images/boulder.png',
        './images/crockie.png',
        './images/grove.png',
        './images/cave.png',
    ];

    playerBoat.style.left = lanes[playerLane] + "px";

    function movePlayer(direction) {
        if (direction === "left" && playerLane > 0) {
            playerLane--;
        } else if (direction === "right" && playerLane < lanes.length - 1) {
            playerLane++;
        }
        playerBoat.style.left = lanes[playerLane] + "px";
    }

    function createHurdle() {
        const hurdle = document.createElement("div");
        hurdle.classList.add("hurdle");

        const randomImage =
            hurdleImages[Math.floor(Math.random() * hurdleImages.length)];
        hurdle.style.backgroundImage = `url('${randomImage}')`;

        const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
        hurdle.style.left = randomLane + "px";
        hurdle.style.top = "-100px";
        gameArea.appendChild(hurdle);

        const hurdleInterval = setInterval(() => {
            const hurdleTop = parseInt(hurdle.style.top);
            hurdle.style.top = hurdleTop + 5 + "px";

            const hurdleRect = hurdle.getBoundingClientRect();
            const playerRect = playerBoat.getBoundingClientRect();

            if (
                hurdleRect.top < playerRect.bottom &&
                hurdleRect.bottom > playerRect.top &&
                hurdleRect.left < playerRect.right &&
                hurdleRect.right > playerRect.left
            ) {
                playSound("wrong");
                clearInterval(hurdleInterval);
                endGame();
            }

            if (hurdleTop > 800) {
                clearInterval(hurdleInterval);
                hurdle.remove();
            }
        }, 20);
    }

    function startGame() {
        if (gameRunning) return;
        playSound("start");
        gameRunning = true;
        startButton.disabled = true;
        
        gameStartTime = Date.now();

        hurdleInterval = setInterval(createHurdle, 1800);
    }

    function endGame() {
        gameRunning = false;
        startButton.disabled = false;
        clearInterval(hurdleInterval);

        const hurdles = document.querySelectorAll(".hurdle");
        hurdles.forEach((hurdle) => hurdle.remove());

        const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000); 
        const distanceCovered = gameDuration * 10; 

        const overlay = document.createElement("div");
        overlay.id = "gameOverlay";

        const popup = document.createElement("div");
        popup.id = "gamePopup";

        popup.innerHTML = `
            <h2 id="gameover">Game Over</h2>
            <p id="score">Your Score: ${distanceCovered}</p>
            <button id="restartButton">Restart</button>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        const restartButton = document.getElementById("restartButton");
        restartButton.addEventListener("click", () => {
            overlay.remove(); // Remove overlay
            resetGame(); // Restart the game
        });
    }

    function resetGame() {
        // Reset player position and variables
        playerLane = 0;
        playerBoat.style.left = lanes[playerLane] + "px";

        // Start the game again
        startGame();
        playSound("start");
    }

    leftButton.addEventListener("click", () => movePlayer("left"));
    rightButton.addEventListener("click", () => movePlayer("right"));
    startButton.addEventListener("click", startGame);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            movePlayer("left");
        } else if (event.key === "ArrowRight") {
            movePlayer("right");
        }
    });

});

function playSound(name) {
    var audio = new Audio("sound/" + name + ".mp3");
    audio.play();
}
