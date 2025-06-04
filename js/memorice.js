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

// Sonidos
const soundCard = new Audio('style/audio/card.mp3');
const soundCheck = new Audio('style/audio/check.mp3');
const soundVictory = new Audio('style/audio/victoria.mp3');

const gameContainer = document.getElementById('gameContainer');

let cardImages = [...images, ...images];
cardImages.sort(() => 0.5 - Math.random());

let firstCard = null;
let lockBoard = true; // Bloquear mientras se muestra la vista previa

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card', 'flipped'); // Mostrar imagen al inicio
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"><img src="${image}" alt=""></div>
            <div class="card-back"><img src="style/assets/Card.png" alt=""></div>
        </div>
    `;
    return card;
}

// Crear y mostrar cartas
cardImages.forEach(image => {
    const card = createCard(image);
    gameContainer.appendChild(card);
});

// Después de 2 segundos, ocultar cartas y activar el juego
setTimeout(() => {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.remove('flipped'));
    allCards.forEach(card => card.addEventListener('click', handleCardClick));
    lockBoard = false;
}, 2000);

// Lógica de clic en cartas
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

            firstCard = null;

            const matchedCards = document.querySelectorAll('.matched');
            if (matchedCards.length === cardImages.length) {
                setTimeout(() => {
                    // 🎉 Confeti + sonido de victoria al mismo tiempo
                    soundVictory.play();

                    const duration = 2000;
                    const end = Date.now() + duration;

                    (function frame() {
                        confetti({
                            particleCount: 7,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 }
                        });
                        confetti({
                            particleCount: 7,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 }
                        });
                        if (Date.now() < end) requestAnimationFrame(frame);
                    })();

                    setTimeout(() => location.reload(), 3000);
                }, 800);
            }
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
