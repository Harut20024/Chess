function showPossibleRookMoves(rook) {
    let rookRow = Math.floor(rook.y / squareSize);
    let rookColumn = Math.floor(rook.x / squareSize);
    
    for (let i = rookColumn + 1; i < 8; i++) { // Right horizontal
        if (isPieceAt(i, rookRow)) {
            if (isEnemyAt(i, rookRow, rook.color)) {
                possibleMovesToEnemy.push([i, rookRow]);
            }
            break;
        } else {
            possibleMoves.push([i, rookRow]);
        }
    }

    for (let i = rookColumn - 1; i >= 0; i--) { // Left horizontal
        if (isPieceAt(i, rookRow)) {
            if (isEnemyAt(i, rookRow, rook.color)) {
                possibleMovesToEnemy.push([i, rookRow]);
            }
            break;
        } else {
            possibleMoves.push([i, rookRow]);
        }
    }

    for (let i = rookRow + 1; i < 8; i++) { // Down vertical
        if (isPieceAt(rookColumn, i)) {
            if (isEnemyAt(rookColumn, i, rook.color)) {
                possibleMovesToEnemy.push([rookColumn, i]);
            }
            break;
        } else {
            possibleMoves.push([rookColumn, i]);
        }
    }

    for (let i = rookRow - 1; i >= 0; i--) { // Up vertical
        if (isPieceAt(rookColumn, i)) {
            if (isEnemyAt(rookColumn, i, rook.color)) {
                possibleMovesToEnemy.push([rookColumn, i]);
            }
            break;
        } else {
            possibleMoves.push([rookColumn, i]);
        }
    }
}
