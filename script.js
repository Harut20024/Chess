let selectedPawn = null;
let possibleMoves = [];
let possibleMovesToEnemy = [];
let originalX;
let originalY;
let rockImage1, rockImage2, pawnImage1, pawnImage2, knightImage1, knightImage2, bishopImage1, bishopImage2, queenImage1, queenImage2, kingImage1, kingImage2;
let squareSize;
let rocks = [];
let pawns = [];
let pieces = [];
let knights = [];
let bishops = [];
let queens = [];
let kings = [];
let isWhitesTurn = true;
let count = 0;

function preload() {
    rockImage1 = loadImage("objects/photos/Rookphotos/Rock1.png");
    rockImage2 = loadImage("objects/photos/Rookphotos/Rock2.png");
    pawnImage1 = loadImage("objects/photos/Pawnphotos/Pawn1.png");
    pawnImage2 = loadImage("objects/photos/Pawnphotos/Pawn2.png");
    knightImage1 = loadImage("objects/photos/Knightphotos/knight1.png");
    knightImage2 = loadImage("objects/photos/Knightphotos/knight2.png");
    bishopImage1 = loadImage("objects/photos/Bishopphotos/Bishop1.png");
    bishopImage2 = loadImage("objects/photos/Bishopphotos/Bishop2.png");
    queenImage1 = loadImage("objects/photos/Queenphotos/Queen1.png");
    queenImage2 = loadImage("objects/photos/Queenphotos/Queen2.png");
    kingImage1 = loadImage("objects/photos/Kingphotos/King1.png");
    kingImage2 = loadImage("objects/photos/Kingphotos/King2.png");
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
        if (i === 3) {
            queens.push(new Queen(i * squareSize, 0, squareSize, 'white', queenImage1));
            queens.push(new Queen(i * squareSize, 7 * squareSize, squareSize, 'black', queenImage2));
        }
        if (i === 4) {
            kings.push(new King(i * squareSize, 0, squareSize, 'white', kingImage1));
            kings.push(new King(i * squareSize, 7 * squareSize, squareSize, 'black', kingImage2));
        }

    }

    pieces = [...pawns, ...rocks, ...knights, ...bishops, ...queens, ...kings];
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
        if (pieces[capturedIndex] instanceof King) {
            alert(capturingPieceColor === 'white' ? 'White wins!' : 'Black wins!');
            noLoop();
            resetGame(); 

        }
        // Remove from the  arrays
        removePieceFromArray(pieces[capturedIndex], pawns);
        removePieceFromArray(pieces[capturedIndex], rocks);
        removePieceFromArray(pieces[capturedIndex], bishops);
        removePieceFromArray(pieces[capturedIndex], knights);
        removePieceFromArray(pieces[capturedIndex], queens);
        removePieceFromArray(pieces[capturedIndex], kings);
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

                // Check the instance of the piece and show moves accordingly
                if (piece instanceof Pawn) {
                    showPossiblePawnMoves(piece);
                } else if (piece instanceof Rook) {
                    showPossibleRookMoves(piece);
                } else if (piece instanceof Knight) {
                    showPossibleKnightMoves(piece);
                } else if (piece instanceof Bishop) {
                    showPossibleBishopMoves(piece);
                } else if (piece instanceof Queen) {
                    showPossibleQueenMoves(piece);
                } else if (piece instanceof King) {
                    showPossibleKingMoves(piece);
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
//updating  turn
function updateTurnDisplay() {
    let turnText = "Turn: " + (isWhitesTurn ? "White" : "Black");
    document.getElementById("turnDisplay").innerText = turnText;

    // Calculate enemy moves only once and pass to checkForCheck
    let enemyColor = isWhitesTurn ? 'black' : 'white';
    let allEnemyMoves = getAllEnemyMoves(enemyColor);
    
    // Only the player whose turn it is can be in check
    checkForCheck(isWhitesTurn ? 'white' : 'black', allEnemyMoves);
}

function checkForCheck(color, enemyMoves) {
    const kingPosition = findKingPosition(color);
    if (kingPosition) {
      for (let move of enemyMoves) {
        if (!move || move.length < 2) {
          console.error('Invalid move detected:', move);
          continue; // Skip this iteration if move is not valid
        }

        if (move[0] === kingPosition.column && move[1] === kingPosition.row) {
          alert(color.charAt(0).toUpperCase() + color.slice(1) + ' King is in Shah (Check)');
          return; // Exit after finding a check
        }
      }
    } else {
      console.error(`King position for ${color} not found.`);
    }
}


  function getAllEnemyMoves(enemyColor) {
    let moves = [];
  
    // Temporarily store possible moves to prevent overriding the actual game state
    let originalPossibleMoves = possibleMoves;
    let originalPossibleMovesToEnemy = possibleMovesToEnemy;
  
    for (let piece of pieces) {
      if (piece.color === enemyColor) {
        possibleMoves = [];
        possibleMovesToEnemy = [];
        
        // Collect the moves according to the type of the piece
        if (piece instanceof Pawn) {
          moves = moves.concat(showPossiblePawnMoves(piece));
        } else if (piece instanceof Rook) {
          moves = moves.concat(showPossibleRookMoves(piece));
        } else if (piece instanceof Knight) {
          moves = moves.concat(showPossibleKnightMoves(piece));
        } else if (piece instanceof Bishop) {
          moves = moves.concat(showPossibleBishopMoves(piece));
        } else if (piece instanceof Queen) {
          moves = moves.concat(showPossibleQueenMoves(piece));
        } else if (piece instanceof King) {
          moves = moves.concat(showPossibleKingMoves(piece));
        }
  
        // Add moves that result in attacks
        moves = moves.concat(possibleMovesToEnemy);
      }
    }
  
    // Restore the original possible moves after calculations
    possibleMoves = originalPossibleMoves;
    possibleMovesToEnemy = originalPossibleMovesToEnemy;
  
    return moves;
  }
  
  
  function findKingPosition(color) {
    for (let piece of pieces) {
      if (piece instanceof King && piece.color === color) {
        return {
          column: Math.floor(piece.x / squareSize),
          row: Math.floor(piece.y / squareSize)
        };
      }
    }
    return null; // In case the king is not found, which should not happen
  }
  
  



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
function resetGame() {
    pieces = [];
    pawns = [];
    rocks = [];
    knights = [];
    bishops = [];
    queens = [];


    isWhitesTurn = true; 


    setup();
}
