const images = [
    'style/assets/Cerebro.png',
    'style/assets/Estrella.png',
    'style/assets/Familia.png',
    'style/assets/Lapiz.png',
    'style/assets/Pelota.png',
    'style/assets/Ampolleta.png',
    'style/assets/Cara.png',
    'style/assets/Musica.png'
];

const soundCard = new Audio('style/audio/card.mp3');
const soundCheck = new Audio('style/audio/check.mp3');
const soundVictory = new Audio('style/audio/victoria.mp3');

const gameContainer = document.getElementById('gameContainer');
let cardImages = [...images, ...images];
cardImages.sort(() => 0.5 - Math.random());

let firstCard = null;
let lockBoard = true;
let paresConfirmados = 0;
let startTime = null;
let timerInterval = null;

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"><img src="${image}" alt=""></div>
            <div class="card-back"><img src="style/assets/Card.png" alt=""></div>
        </div>
    `;
    return card;
}

function startTimer() {
    startTime = Date.now();
    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer';
    document.body.appendChild(timerDisplay);

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `⏱️ Tiempo: ${elapsed} segundos`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    return elapsed;
}

// Crear y mostrar cartas
cardImages.forEach(image => {
    const card = createCard(image);
    gameContainer.appendChild(card);
});

const allCards = document.querySelectorAll('.card');
allCards.forEach(card => card.classList.add('flipped'));

setTimeout(() => {
    allCards.forEach(card => card.classList.remove('flipped'));
    allCards.forEach(card => card.addEventListener('click', handleCardClick));
    lockBoard = false;
    startTimer();
}, 500);

function handleCardClick() {
    const card = this;

    if (lockBoard || card.classList.contains('matched') || card === firstCard) return;

    soundCard.currentTime = 0;
    soundCard.play();
    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
    } else {
        const img1 = firstCard.querySelector('.card-front img').src;
        const img2 = card.querySelector('.card-front img').src;

        if (img1 === img2) {
            firstCard.classList.add('matched');
            card.classList.add('matched');

            soundCheck.currentTime = 0;
            soundCheck.play();

            confetti({
                particleCount: 40,
                spread: 70,
                origin: { x: 0.5, y: 0.5 }
            });

            paresConfirmados++;

            if (paresConfirmados === images.length) {
                setTimeout(() => {
                    const totalTime = stopTimer();
                    soundVictory.play();

                    // 🎊 Confeti intenso en múltiples direcciones
                    const duration = 2000;
                    const end = Date.now() + duration;

                    (function frame() {
                        confetti({
                            particleCount: 10,
                            spread: 100,
                            origin: { x: Math.random(), y: Math.random() * 0.5 }
                        });
                        if (Date.now() < end) requestAnimationFrame(frame);
                    })();

                    mostrarPantallaVictoria(totalTime);
                    setTimeout(() => location.reload(), 5000);
                }, 800);
            }

            firstCard = null;
        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                card.classList.remove('flipped');
                firstCard = null;
                lockBoard = false;
            }, 1000);
        }
    }
}

function mostrarPantallaVictoria(tiempo) {
    const box = document.createElement('div');
    box.id = 'victoryBox';
    box.innerHTML = `
        <h2>🏆 ¡Felicidades!</h2>
        <p>Encontraste todos los pares</p>
        <p>⏱️ Tiempo total: ${tiempo} segundos</p>
    `;
    document.body.appendChild(box);
}
