// Socket.IO connection
const socket = io();

// UI Elements
const menuScreen = document.getElementById('menuScreen');
const searchingScreen = document.getElementById('searchingScreen');
const matchFoundScreen = document.getElementById('matchFoundScreen');
const gameCanvas = document.getElementById('gameCanvas');
const findMatchBtn = document.getElementById('findMatchBtn');
const cancelSearchBtn = document.getElementById('cancelSearchBtn');
const betAmountSelect = document.getElementById('betAmount');
const searchStatus = document.getElementById('searchStatus');
const searchBetAmount = document.getElementById('searchBetAmount');
const matchBetAmount = document.getElementById('matchBetAmount');
const queueCount = document.getElementById('queueCount');

let currentBetAmount = 50;
let gameInstance = null;

// Sound effects (using Web Audio API)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Sound effect functions
function playCardFlip() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 200;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playCardDeal() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 150;
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
}

function playWinSound() {
    const notes = [523.25, 659.25, 783.99]; // C, E, G major chord
    notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = freq;
        const startTime = audioContext.currentTime + (i * 0.1);
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
    });
}

function playLoseSound() {
    const notes = [392, 349.23, 293.66]; // G, F, D descending
    notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = freq;
        const startTime = audioContext.currentTime + (i * 0.15);
        gainNode.gain.setValueAtTime(0.25, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
    });
}

function playChipSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 1200;
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
}

// Find match button
findMatchBtn.addEventListener('click', () => {
    currentBetAmount = parseInt(betAmountSelect.value);
    
    socket.emit('findMatch', { betAmount: currentBetAmount });

    // Show searching screen
    menuScreen.classList.add('hidden');
    searchingScreen.classList.remove('hidden');
    searchBetAmount.textContent = currentBetAmount;
});

// Cancel search button
cancelSearchBtn.addEventListener('click', () => {
    socket.emit('cancelSearch');
    
    // Return to menu
    searchingScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
});

// Socket event listeners
socket.on('searching', (data) => {
    searchStatus.textContent = data.message;
    queueCount.textContent = data.playersInQueue;
});

socket.on('searchCancelled', (data) => {
    console.log(data.message);
});

socket.on('matchFound', (data) => {
    searchingScreen.classList.add('hidden');
    matchFoundScreen.classList.remove('hidden');
    matchBetAmount.textContent = data.betAmount;
    
    setTimeout(() => {
        matchFoundScreen.classList.add('hidden');
        gameCanvas.classList.remove('hidden');
        
        // Initialize Phaser game
        if (!gameInstance) {
            initGame();
        }
    }, 2000);
});

socket.on('gameStarting', (data) => {
    if (gameInstance && gameInstance.scene.scenes[0]) {
        gameInstance.scene.scenes[0].startGameAnimation(data);
    }
});

socket.on('dealCards', (data) => {
    if (gameInstance && gameInstance.scene.scenes[0]) {
        gameInstance.scene.scenes[0].dealCardsAnimation(data);
    }
});

socket.on('gameState', (gameState) => {
    if (gameInstance && gameInstance.scene.scenes[0]) {
        gameInstance.scene.scenes[0].updateGameState(gameState);
    }
});

socket.on('gameResults', (results) => {
    if (gameInstance && gameInstance.scene.scenes[0]) {
        gameInstance.scene.scenes[0].showResults(results);
    }
});

socket.on('opponentDisconnected', (data) => {
    alert(data.message);
    location.reload();
});

socket.on('opponentWantsRematch', (data) => {
    if (confirm(data.message + ' Play again?')) {
        socket.emit('playAgain');
        location.reload();
    }
});

// Phaser Game Configuration
function initGame() {
    const config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 700,
        parent: 'gameCanvas',
        backgroundColor: '#0a5f38',
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    gameInstance = new Phaser.Game(config);
}

// Enhanced Card class with animations
class EnhancedCard {
    constructor(scene, value, index, isPlayer) {
        this.scene = scene;
        this.value = value;
        this.revealed = false;
        this.isPlayer = isPlayer;
        
        // Card dimensions
        this.width = 100;
        this.height = 140;
        
        // Create card container
        this.container = scene.add.container(-200, isPlayer ? 600 : 100);
        
        // Card back (red pattern)
        this.cardBack = scene.add.rectangle(0, 0, this.width, this.height, 0xcc0000);
        this.cardBack.setStrokeStyle(4, 0x880000);
        
        // Card pattern
        const pattern = scene.add.grid(0, 0, this.width - 10, this.height - 10, 20, 20, 0xff0000, 0.3);
        
        // Card front (white)
        this.cardFront = scene.add.rectangle(0, 0, this.width, this.height, 0xffffff);
        this.cardFront.setStrokeStyle(4, 0x333333);
        this.cardFront.setVisible(false);
        
        // Card value text
        this.valueText = scene.add.text(0, 0, '?', {
            fontSize: '56px',
            color: '#000',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setVisible(false);
        
        // Card suit decoration
        this.suitText = scene.add.text(0, -45, '♠', {
            fontSize: '24px',
            color: '#000'
        }).setOrigin(0.5).setVisible(false);
        
        // Add to container
        this.container.add([this.cardBack, pattern, this.cardFront, this.valueText, this.suitText]);
        this.container.setScale(0.8);
    }

    dealTo(x, y, delay) {
        playCardDeal();
        
        // Make sure container is visible
        this.container.setAlpha(1);
        
        this.scene.tweens.add({
            targets: this.container,
            x: x,
            y: y,
            duration: 500,
            delay: delay,
            ease: 'Power2',
            onComplete: () => {
                // Card bounce effect
                this.scene.tweens.add({
                    targets: this.container,
                    scaleX: 0.9,
                    scaleY: 0.9,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        // Ensure card stays at final scale
                        this.container.setScale(0.8);
                    }
                });
            }
        });
    }

    flip(delay = 0) {
        setTimeout(() => {
            playCardFlip();
            
            // Flip animation - scale X to 0
            this.scene.tweens.add({
                targets: this.container,
                scaleX: 0,
                duration: 150,
                ease: 'Power2',
                onComplete: () => {
                    // Hide back, show front
                    this.cardBack.setVisible(false);
                    this.cardFront.setVisible(true);
                    this.valueText.setVisible(true);
                    this.suitText.setVisible(true);
                    this.valueText.setText(this.value.toString());
                    
                    // Color based on value
                    if (this.value === 10) {
                        this.valueText.setColor('#ff0000');
                        this.suitText.setText('♥');
                        this.suitText.setColor('#ff0000');
                    } else if (this.value === 9) {
                        this.valueText.setColor('#ffd700');
                        this.suitText.setText('♦');
                        this.suitText.setColor('#ffd700');
                    } else {
                        this.valueText.setColor('#000000');
                        this.suitText.setText('♠');
                        this.suitText.setColor('#000000');
                    }
                    
                    // Flip back to visible
                    this.scene.tweens.add({
                        targets: this.container,
                        scaleX: 0.8,
                        scaleY: 0.8,
                        duration: 150,
                        ease: 'Power2',
                        onComplete: () => {
                            // Ensure final visibility
                            this.container.setAlpha(1);
                            this.revealed = true;
                        }
                    });
                }
            });
        }, delay);
    }

    destroy() {
        this.container.destroy();
    }
}

// Particle effects
function createWinParticles(scene, x, y) {
    const particles = scene.add.particles(x, y);
    
    for (let i = 0; i < 30; i++) {
        const particle = scene.add.circle(x, y, 5, 0xffd700);
        const angle = (Math.PI * 2 * i) / 30;
        const speed = 100 + Math.random() * 100;
        
        scene.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * speed,
            y: y + Math.sin(angle) * speed,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => particle.destroy()
        });
    }
}

function createLoseEffect(scene, x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = scene.add.circle(x, y, 8, 0x666666);
        
        scene.tweens.add({
            targets: particle,
            y: y + 100 + Math.random() * 100,
            x: x + (Math.random() - 0.5) * 100,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => particle.destroy()
        });
    }
}

// Game Scene
let myCards = [];
let opponentCards = [];
let gameState = null;
let statusText, myScoreText, opponentScoreText, myMoneyText, potText;
let resultsGroup;
let tableFelt, deckPile;

function preload() {
    // No external assets needed
}

function create() {
    const scene = this;
    
    // Initialize chip group
    this.chipGroup = null;
    
    // Table felt texture
    const feltGraphics = this.add.graphics();
    feltGraphics.fillGradientStyle(0x0a4f2e, 0x0a4f2e, 0x083d24, 0x083d24, 1);
    feltGraphics.fillRect(0, 0, 1000, 700);
    
    // Table border
    const border = this.add.rectangle(500, 350, 980, 680);
    border.setStrokeStyle(8, 0x8b4513);
    
    // Decorative corners
    [50, 950].forEach(x => {
        [50, 650].forEach(y => {
            const corner = this.add.circle(x, y, 20, 0xffd700);
            corner.setStrokeStyle(3, 0xffed4e);
        });
    });
    
    // Title with glow effect
    const titleBg = this.add.rectangle(500, 40, 250, 60, 0x000000, 0.5);
    titleBg.setStrokeStyle(2, 0xffd700);
    
    const title = this.add.text(500, 40, '🎴 NOUFI', {
        fontSize: '40px',
        color: '#ffd700',
        fontStyle: 'bold',
        fontFamily: 'Arial',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5);
    
    // Deck pile (center)
    deckPile = this.add.container(500, 350);
    for (let i = 0; i < 5; i++) {
        const card = this.add.rectangle(i * 2, i * 2, 100, 140, 0xcc0000);
        card.setStrokeStyle(4, 0x880000);
        deckPile.add(card);
    }
    
    // Pot display (center)
    const potBg = this.add.rectangle(500, 280, 180, 50, 0x000000, 0.7);
    potBg.setStrokeStyle(2, 0xffd700);
    
    potText = this.add.text(500, 280, 'POT: $0', {
        fontSize: '24px',
        color: '#ffd700',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Opponent section (top)
    const oppBg = this.add.rectangle(500, 110, 300, 80, 0x000000, 0.6);
    oppBg.setStrokeStyle(2, 0xff4444);
    
    this.add.text(500, 90, '🎭 OPPONENT', {
        fontSize: '20px',
        color: '#ff6666',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    opponentScoreText = this.add.text(500, 120, 'Score: ?', {
        fontSize: '22px',
        color: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // Player section (bottom)
    const playerBg = this.add.rectangle(500, 590, 300, 100, 0x000000, 0.6);
    playerBg.setStrokeStyle(2, 0x44ff44);
    
    this.add.text(500, 560, '🎮 YOU', {
        fontSize: '20px',
        color: '#66ff66',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    myScoreText = this.add.text(500, 590, 'Score: ?', {
        fontSize: '22px',
        color: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    myMoneyText = this.add.text(500, 620, 'Money: $1000', {
        fontSize: '18px',
        color: '#00ff00',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // Status text
    statusText = this.add.text(500, 350, 'Dealing cards...', {
        fontSize: '28px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3
    }).setOrigin(0.5);

    // Results group
    resultsGroup = this.add.group();

    // Store scene reference and bind functions
    this.startGameAnimation = startGameAnimation.bind(this);
    this.dealCardsAnimation = dealCardsAnimation.bind(this);
    this.updateGameState = updateGameState.bind(this);
    this.showResults = showResults.bind(this);
}

function update() {
    // Game loop
}

function startGameAnimation(data) {
    gameState = data;
    
    statusText.setText('Game starting...');
    
    // Show pot with chips
    const totalPot = data.betAmount * 2;
    potText.setText(`POT: $${totalPot}`);
    
    // Create chip stacks
    createChipStacks(this.scene.scene, 500, 320, data.betAmount);
    playChipSound();
    
    // Show dealer
    setTimeout(() => {
        showDealer(this.scene.scene);
        statusText.setText('Dealer ready...');
    }, 500);
    
    // Make deck visible
    setTimeout(() => {
        deckPile.setAlpha(1);
        statusText.setText('Shuffling deck...');
    }, 1000);
}

function dealCardsAnimation(data) {
    // Clear existing cards
    myCards.forEach(card => card.destroy());
    opponentCards.forEach(card => card.destroy());
    myCards = [];
    opponentCards = [];
    
    statusText.setText('Dealer is dealing cards...');
    
    // Deal cards one by one - alternating
    const dealDelay = 600; // ms between each card
    
    for (let i = 0; i < 3; i++) {
        // Opponent card
        setTimeout(() => {
            const oppCard = new EnhancedCard(this.scene.scene, 0, i, false); // Value hidden
            const oppX = 350 + (i * 120);
            const oppY = 180;
            oppCard.dealTo(oppX, oppY, 0);
            opponentCards.push(oppCard);
            statusText.setText(`Dealing... (${(i * 2) + 1}/6)`);
        }, (i * 2) * dealDelay);
        
        // Player card  
        setTimeout(() => {
            const playerCard = new EnhancedCard(this.scene.scene, data.myCards[i], i, true);
            const playerX = 350 + (i * 120);
            const playerY = 520;
            playerCard.dealTo(playerX, playerY, 0);
            myCards.push(playerCard);
            statusText.setText(`Dealing... (${(i * 2) + 2}/6)`);
        }, ((i * 2) + 1) * dealDelay);
    }
    
    // Hide deck and dealer after dealing
    setTimeout(() => {
        this.scene.scene.tweens.add({
            targets: deckPile,
            alpha: 0,
            duration: 500
        });
        hideDealer(this.scene.scene);
    }, 6 * dealDelay + 500);
    
    // Reveal player cards
    setTimeout(() => {
        statusText.setText('Revealing your cards...');
        myCards.forEach((card, i) => {
            card.value = data.myCards[i]; // Set real value
            card.flip(i * 300);
        });
        
        setTimeout(() => {
            myScoreText.setText(`Score: ${data.myScore}`);
            statusText.setText('Waiting for opponent...');
        }, 1200);
    }, 6 * dealDelay + 1000);
    
    // Update money
    myMoneyText.setText(`Money: $${gameState.myMoney}`);
}

function updateGameState(state) {
    // Legacy support - shouldn't be called anymore
    console.log('Legacy updateGameState called');
}

// Dealer figure
let dealerContainer;

function showDealer(scene) {
    if (dealerContainer) {
        dealerContainer.destroy();
    }
    
    dealerContainer = scene.add.container(100, 350);
    
    // Dealer body (circle for head, rectangle for body)
    const head = scene.add.circle(0, -30, 25, 0xffdbac);
    head.setStrokeStyle(2, 0x000000);
    
    const body = scene.add.rectangle(0, 10, 50, 60, 0x000000);
    
    // Dealer hands
    const leftArm = scene.add.rectangle(-25, 0, 8, 40, 0xffdbac);
    leftArm.setStrokeStyle(1, 0x000000);
    leftArm.setAngle(-45);
    
    const rightArm = scene.add.rectangle(25, 0, 8, 40, 0xffdbac);
    rightArm.setStrokeStyle(1, 0x000000);
    rightArm.setAngle(45);
    
    // Bow tie
    const bowtie = scene.add.rectangle(0, -5, 15, 8, 0xff0000);
    
    // Eyes
    const leftEye = scene.add.circle(-8, -35, 3, 0x000000);
    const rightEye = scene.add.circle(8, -35, 3, 0x000000);
    
    // Label
    const dealerText = scene.add.text(0, 60, 'DEALER', {
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: 'bold',
        backgroundColor: '#000000',
        padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    
    dealerContainer.add([body, leftArm, rightArm, head, bowtie, leftEye, rightEye, dealerText]);
    
    // Animate dealer arm (dealing motion)
    scene.tweens.add({
        targets: rightArm,
        angle: 90,
        duration: 300,
        yoyo: true,
        repeat: 5
    });
    
    dealerContainer.setAlpha(0);
    scene.tweens.add({
        targets: dealerContainer,
        alpha: 1,
        duration: 500
    });
}

function hideDealer(scene) {
    if (dealerContainer) {
        scene.tweens.add({
            targets: dealerContainer,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                if (dealerContainer) {
                    dealerContainer.destroy();
                    dealerContainer = null;
                }
            }
        });
    }
}

// Chip stacks visualization
function createChipStacks(scene, x, y, betAmount) {
    // Remove old chips if any
    if (scene.chipGroup) {
        scene.chipGroup.destroy(true);
    }
    
    scene.chipGroup = scene.add.group();
    
    // Calculate number of chips based on bet
    const chipsPerStack = Math.min(Math.floor(betAmount / 10), 10);
    const numStacks = 2; // Player and opponent stacks
    
    // Player chips (left side)
    for (let stack = 0; stack < 2; stack++) {
        const stackX = x - 60 + (stack * 30);
        for (let i = 0; i < chipsPerStack; i++) {
            const chip = scene.add.circle(stackX, y - (i * 4), 15, 0xffd700);
            chip.setStrokeStyle(3, 0xffed4e);
            
            // Add value marking
            if (i === 0) {
                const valueText = scene.add.text(stackX, y - (i * 4), '$', {
                    fontSize: '12px',
                    color: '#000',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                scene.chipGroup.add(valueText);
            }
            
            scene.chipGroup.add(chip);
        }
    }
    
    // Opponent chips (right side)
    for (let stack = 0; stack < 2; stack++) {
        const stackX = x + 30 + (stack * 30);
        for (let i = 0; i < chipsPerStack; i++) {
            const chip = scene.add.circle(stackX, y - (i * 4), 15, 0xff4444);
            chip.setStrokeStyle(3, 0xcc0000);
            
            if (i === 0) {
                const valueText = scene.add.text(stackX, y - (i * 4), '$', {
                    fontSize: '12px',
                    color: '#fff',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                scene.chipGroup.add(valueText);
            }
            
            scene.chipGroup.add(chip);
        }
    }
    
    // Bet amount labels
    const playerBetLabel = scene.add.text(x - 45, y + 25, `You: $${betAmount}`, {
        fontSize: '14px',
        color: '#ffd700',
        fontStyle: 'bold',
        backgroundColor: '#000000',
        padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    
    const oppBetLabel = scene.add.text(x + 45, y + 25, `Opp: $${betAmount}`, {
        fontSize: '14px',
        color: '#ff4444',
        fontStyle: 'bold',
        backgroundColor: '#000000',
        padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    
    scene.chipGroup.add([playerBetLabel, oppBetLabel]);
    
    // Animate chips appearing
    scene.chipGroup.getChildren().forEach((chip, i) => {
        chip.setAlpha(0);
        scene.tweens.add({
            targets: chip,
            alpha: 1,
            duration: 200,
            delay: i * 50
        });
    });
}

function showResults(results) {
    // Reveal opponent cards
    opponentCards.forEach((card, i) => {
        card.value = results.opponentCards[i];
        card.flip(i * 200);
    });
    
    setTimeout(() => {
        opponentScoreText.setText(`Score: ${results.opponentScore}`);
        statusText.setText('');
        
        // Determine result
        let resultMessage = '';
        let resultColor = '#ffffff';
        let isWin = false;

        if (results.winner === socket.id) {
            resultMessage = `🎉 VICTORY! 🎉\n+$${results.betAmount}`;
            resultColor = '#00ff00';
            isWin = true;
            playWinSound();
            createWinParticles(this.scene.scene, 500, 350);
        } else if (results.winner === 'tie') {
            resultMessage = '🤝 TIE GAME! 🤝\nNo money exchanged';
            resultColor = '#ffff00';
        } else {
            resultMessage = `😔 DEFEAT\n-$${results.betAmount}`;
            resultColor = '#ff0000';
            playLoseSound();
            createLoseEffect(this.scene.scene, 500, 350);
        }

        // Result panel with animation
        const resultBg = this.scene.scene.add.rectangle(500, 350, 450, 200, 0x000000, 0.9);
        resultBg.setStrokeStyle(4, isWin ? 0x00ff00 : 0xff0000);
        resultBg.setScale(0);
        
        this.scene.scene.tweens.add({
            targets: resultBg,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back'
        });

        const resultText = this.scene.scene.add.text(500, 320, resultMessage, {
            fontSize: '36px',
            color: resultColor,
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000',
            strokeThickness: 5
        }).setOrigin(0.5).setAlpha(0);
        
        this.scene.scene.tweens.add({
            targets: resultText,
            alpha: 1,
            duration: 500,
            delay: 300
        });

        const scoreText = this.scene.scene.add.text(500, 380, 
            `Your: ${results.myScore} | Opponent: ${results.opponentScore}`, {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        
        this.scene.scene.tweens.add({
            targets: scoreText,
            alpha: 1,
            duration: 500,
            delay: 500
        });

        // Play Again button with hover effect
        const playAgainBtn = this.scene.scene.add.rectangle(500, 440, 220, 55, 0xffd700);
        playAgainBtn.setInteractive({ useHandCursor: true });
        playAgainBtn.setStrokeStyle(4, 0xffed4e);
        playAgainBtn.setAlpha(0);
        
        this.scene.scene.tweens.add({
            targets: playAgainBtn,
            alpha: 1,
            duration: 500,
            delay: 700
        });
        
        const playAgainText = this.scene.scene.add.text(500, 440, 'Play Again', {
            fontSize: '24px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        
        this.scene.scene.tweens.add({
            targets: playAgainText,
            alpha: 1,
            duration: 500,
            delay: 700
        });

        playAgainBtn.on('pointerdown', () => {
            playChipSound();
            socket.emit('playAgain');
            location.reload();
        });

        playAgainBtn.on('pointerover', () => {
            playAgainBtn.setFillStyle(0xffed4e);
            this.scene.scene.tweens.add({
                targets: playAgainBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        playAgainBtn.on('pointerout', () => {
            playAgainBtn.setFillStyle(0xffd700);
            this.scene.scene.tweens.add({
                targets: playAgainBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        // Update money with animation
        myMoneyText.setText(`Money: $${results.myNewMoney}`);
        
        if (isWin) {
            this.scene.scene.tweens.add({
                targets: myMoneyText,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 200,
                yoyo: true,
                repeat: 2
            });
        }

        resultsGroup.add([resultBg, resultText, scoreText, playAgainBtn, playAgainText]);
    }, 1000);
}
