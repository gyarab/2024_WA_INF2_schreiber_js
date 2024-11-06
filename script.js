class PexesoGame {
    constructor(container, size = 4) {
        this.container = container;
        this.size = size;
        this.currentPlayer = 1;
        this.scores = { 1: 0, 2: 0 };
        this.moves = 0;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.canFlip = true;
        
        this.init();
    }
    
    init() {
        this.createGameContainer();
        this.createControls();
        this.createStatus();
        this.createBoard();
        this.setupNewGame();
    }
    
    createGameContainer() {
        this.gameContainer = document.createElement('div');
        this.gameContainer.className = 'game-container';
        this.container.appendChild(this.gameContainer);
    }
    
    createControls() {
        const controls = document.createElement('div');
        controls.className = 'controls';
        
        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Velikost hrací plochy: ';
        const sizeSelect = document.createElement('select');
        [2, 4, 6].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}x${size}`;
            if (size === this.size) option.selected = true;
            sizeSelect.appendChild(option);
        });
        sizeSelect.addEventListener('change', (e) => {
            this.size = parseInt(e.target.value);
            this.resetGame();
        });
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Nová hra';
        resetButton.className = 'nova-hra'
        resetButton.style.marginLeft = '10px';
        resetButton.addEventListener('click', () => this.resetGame());
        
        controls.appendChild(sizeLabel);
        controls.appendChild(sizeSelect);
        controls.appendChild(resetButton);
        this.gameContainer.appendChild(controls);
    }
    
    createStatus() {
        this.status = document.createElement('div');
        this.status.className = 'status';
        this.gameContainer.appendChild(this.status);
        this.updateStatus();
    }
    
    createBoard() {
        this.board = document.createElement('div');
        this.board.className = 'board';
        this.board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        this.gameContainer.appendChild(this.board);
    }
    
    setupNewGame() {
        const totalCards = this.size * this.size;
        const pairs = totalCards / 2;
        const numbers = Array.from({length: pairs}, (_, i) => i + 1);
        const cards = [...numbers, ...numbers];
        this.cards = this.shuffleArray(cards);
        
        this.board.innerHTML = '';
        this.board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        
        this.cards.forEach((number, index) => {
            
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            

            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.number = number;
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.textContent = '?';
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.textContent = number;
            
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            cardContainer.appendChild(card);
            
            card.addEventListener('click', () => this.flipCard(card));
            this.board.appendChild(cardContainer);
        });
        
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.scores = { 1: 0, 2: 0 };
        this.currentPlayer = 1;
        this.canFlip = true;
        
        this.updateStatus();
    }
    
    flipCard(card) {
        if (!this.canFlip || this.flippedCards.includes(card) || 
            card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.canFlip = false;
            this.checkMatch();
        }
        
        this.updateStatus();
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.number === card2.dataset.number;
        
        setTimeout(() => {
            if (match) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.scores[this.currentPlayer]++;
                this.matchedPairs++;
                
                if (this.matchedPairs === (this.size * this.size) / 2) {
                    this.endGame();
                }
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            }
            
            this.flippedCards = [];
            this.canFlip = true;
            this.updateStatus();
        }, 1000);
    }
    
    updateStatus() {
        const status = [
            `Hráč 1: ${this.scores[1]} | Hráč 2: ${this.scores[2]}`,
            `Na tahu: Hráč ${this.currentPlayer}`,
            `Počet tahů: ${this.moves}`
        ];
        this.status.textContent = status.join(' | ');
    }
    
    endGame() {
        const winner = this.scores[1] > this.scores[2] ? 1 : 
                        this.scores[1] < this.scores[2] ? 2 : 'Remíza';
        
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const winnerText = document.createElement('h2');
        winnerText.textContent = winner === 'Remíza' ? 
            'Hra skončila remízou!' : 
            `Vyhrál Hráč ${winner}!`;
        
        const newGameButton = document.createElement('button');
        newGameButton.textContent = 'Nová hra';
        newGameButton.addEventListener('click', () => {
            modalOverlay.remove();
            this.resetGame();
        });
        
        modalContent.appendChild(winnerText);
        modalContent.appendChild(newGameButton);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }
    
    resetGame() {
        this.setupNewGame();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    new PexesoGame(app);
});