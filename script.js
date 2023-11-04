let selectedPawn = null;
let possibleMoves = [];
let possibleMovesToEnemy = [];
let originalX;
let originalY;
let rockImage1;
let rockImage2;
let pawnImage1;
let pawnImage2;
let knightImage1;
let knightImage2;
let bishopImage1;
let bishopImage2;
let squareSize;
let rocks = [];
let pawns = [];
let pieces = [];
let knights = [];
let bishops = [];
let isWhitesTurn = true;

function preload() {
    rockImage1 = loadImage("objects/photos/Rookphotos/Rock1.png");
    rockImage2 = loadImage("objects/photos/Rookphotos/Rock2.png");
    pawnImage1 = loadImage("objects/photos/Pawnphotos/Pawn1.png");
    pawnImage2 = loadImage("objects/photos/Pawnphotos/Pawn2.png");
    knightImage1 = loadImage("objects/photos/Knightphotos/knight1.png");
    knightImage2 = loadImage("objects/photos/Knightphotos/knight2.png");
    bishopImage1 = loadImage("objects/photos/Bishopphotos/Bishop1.png");
    bishopImage2 = loadImage("objects/photos/Bishopphotos/Bishop2.png");
}

function setup() {
    let canvasSize = 700;
    createCanvas(canvasSize, canvasSize);
    squareSize = width / 8;
    noLoop();

    for (let i = 0; i < 8; i++) {
        pawns.push(new Pawn(i * squareSize, squareSize, squareSize, "white", pawnImage1));
        pawns.push(new Pawn(i * squareSize, 6 * squareSize, squareSize, 'black', pawnImage2));
        if (i === 0 || i === 7) {
            rocks.push(new Rook(i * squareSize, 0, squareSize, 'white', rockImage1));
            rocks.push(new Rook(i * squareSize, 7 * squareSize, squareSize, 'black', rockImage2));
        }
        if (i === 1 || i === 6) {
            knights.push(new Knight(i * squareSize, 0, squareSize, 'white', knightImage1));
            knights.push(new Knight(i * squareSize, 7 * squareSize, squareSize, 'black', knightImage2));
        }
        if (i === 2 || i === 5) {
            bishops.push(new Bishop(i * squareSize, 0, squareSize, 'white', bishopImage1));
            bishops.push(new Bishop(i * squareSize, 7 * squareSize, squareSize, 'black', bishopImage2));
        }

    }

    pieces = [...pawns, ...rocks,...knights,...bishops];
}

function draw() {
    background(255);
    drawBoard();
    drawPossibleMoves();
    drawPossibleAttacks();

    for (let piece of pieces) {
        piece.display();
    }

}

function mouseReleased() {
    if (selectedPawn) {
        let newX = Math.floor(mouseX / squareSize);
        let newY = Math.floor(mouseY / squareSize);

        let validMove = possibleMoves.some(move => move[0] === newX && move[1] === newY);
        let validAttack = possibleMovesToEnemy.some(move => move[0] === newX && move[1] === newY);

        if (validMove || validAttack) {
            selectedPawn.hasMoved = true;
            isWhitesTurn = !isWhitesTurn;
            updateTurnDisplay();
            if (validAttack) {
                removeCapturedPiece(newX, newY, selectedPawn.color);
            }
            selectedPawn.setPosition(newX * squareSize, newY * squareSize);
        } else {
            selectedPawn.setPosition(originalX, originalY);
        }
        selectedPawn = null;
        possibleMoves = [];
        possibleMovesToEnemy = [];
        cursor(ARROW);
        redraw();
    }
}

function removeCapturedPiece(column, row, capturingPieceColor) {
    const capturedIndex = pieces.findIndex(piece => isSamePositionAndColor(piece, column, row, capturingPieceColor));
    if (capturedIndex !== -1) {
        // Remove from the  arrays
        removePieceFromArray(pieces[capturedIndex], pawns);
        removePieceFromArray(pieces[capturedIndex], rocks);
        pieces.splice(capturedIndex, 1);
    }
}

function removePieceFromArray(pieceToRemove, array) {
    const index = array.indexOf(pieceToRemove);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

function isSamePositionAndColor(piece, column, row, capturingPieceColor) {
    const pieceColumn = Math.floor(piece.x / squareSize);
    const pieceRow = Math.floor(piece.y / squareSize);
    const isSamePosition = pieceColumn === column && pieceRow === row;
    const isOppositeColor = piece.color !== capturingPieceColor;
    return isSamePosition && isOppositeColor;
}


function mousePressed() {
    possibleMoves = [];
    possibleMovesToEnemy = [];

    for (let piece of pieces) {
        if (piece.isClicked(mouseX, mouseY)) {
            if ((isWhitesTurn && piece.color === "white") || (!isWhitesTurn && piece.color === "black")) {
                selectedPawn = piece;
                originalX = piece.x;
                originalY = piece.y;
                cursor(HAND);

                // Determine which piece type is selected and show the possible moves
                if (piece instanceof Pawn) {
                    showPossiblePawnMoves(piece);
                } else if (piece instanceof Rook) {
                    showPossibleRookMoves(piece);
                } else if (piece instanceof Knight) {
                    showPossibleKnightMoves(piece);
                } else if (piece instanceof Bishop) {
                    showPossibleBishopMoves(piece); // Show moves for bishop
                }
                return;
            }
        }
    }   

    redraw();
}






function isEnemyAt(column, row, color) {
    return pieces.some(piece => {
        return Math.floor(piece.x / squareSize) === column
            && Math.floor(piece.y / squareSize) === row
            && piece.color !== color;
    });
}

function isPieceAt(column, row) {
    return pieces.some(piece => {
        return Math.floor(piece.x / squareSize) === column && Math.floor(piece.y / squareSize) === row;
    });
}


function drawPossibleMoves() {
    possibleMoves.forEach(([x, y]) => {
        fill('rgba(0, 255, 0, 0.5)');
        ellipse(x * squareSize + squareSize / 2, y * squareSize + squareSize / 2, 30, 30);
    });
}
function drawPossibleAttacks() {
    possibleMovesToEnemy.forEach(([x, y]) => {
        fill('rgba(255, 0, 0, 0.5)');
        rect(x * squareSize, y * squareSize, squareSize, squareSize);
    });
}
function mouseDragged() {
    if (selectedPawn) {
        selectedPawn.setPosition(mouseX - squareSize / 2, mouseY - squareSize / 2);
        redraw();
    }
}

function updateTurnDisplay() {
    let turnText = "Turn: " + (isWhitesTurn ? "White" : "Black");
    document.getElementById("turnDisplay").innerText = turnText;
}

document.getElementById('darkModeSwitch').addEventListener('change', (event) => {
    let chessBoard = document.getElementById('gameContainer');
    if (event.target.checked) {
        chessBoard.className = 'dark-mode';
    } else {
        chessBoard.className = 'light-mode';
    }
    redraw()
});

function drawBoard() {
    let lightColor = color('#EEEED2');
    let darkColor = color('#769656');

    let isDarkMode = document.getElementById('gameContainer').classList.contains('dark-mode');
    if (isDarkMode) {
        lightColor = color('#f2d1b3');
        darkColor = color('#4d2600');
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            fill((i + j) % 2 === 0 ? lightColor : darkColor);
            rect(j * squareSize, i * squareSize, squareSize, squareSize);
        }
    }
}
