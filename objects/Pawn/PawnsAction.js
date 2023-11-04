function showPossiblePawnMoves(pawn) {
    const column = Math.floor(pawn.x / squareSize);
    const row = Math.floor(pawn.y / squareSize);

    // Forward move for white pawn
    if (pawn.color === 'white' && !isPieceAt(column, row + 1)) {
        possibleMoves.push([column, row + 1]);

        // Two steps forward for white pawn on its first move
        if (!pawn.hasMoved && !isPieceAt(column, row + 2)) {
            possibleMoves.push([column, row + 2]);
        }
    }

    // Capture moves for white pawn
    if (pawn.color === 'white' && isEnemyAt(column + 1, row + 1, 'white')) {
        possibleMovesToEnemy.push([column + 1, row + 1]);
    }
    if (pawn.color === 'white' && isEnemyAt(column - 1, row + 1, 'white')) {
        possibleMovesToEnemy.push([column - 1, row + 1]);
    }

    
    // Forward move for black pawn
    if (pawn.color === 'black' && !isPieceAt(column, row - 1)) {
        possibleMoves.push([column, row - 1]);

        // Two steps forward for black pawn on its first move
        if (!pawn.hasMoved && !isPieceAt(column, row - 2)) {
            possibleMoves.push([column, row - 2]);
        }
    }
    // Capture moves for black pawn
    if (pawn.color === 'black' && isEnemyAt(column + 1, row - 1, 'black')) {
        possibleMovesToEnemy.push([column + 1, row - 1]);
    }
    if (pawn.color === 'black' && isEnemyAt(column - 1, row - 1, 'black')) {
        possibleMovesToEnemy.push([column - 1, row - 1]);
    }
}


