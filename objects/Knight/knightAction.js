function showPossibleKnightMoves(knight) {
    // These are the relative movements a knight can make (in 'L' shapes)
    const moves = [
        { x: 1, y: 2 },
        { x: 2, y: 1 },
        { x: 2, y: -1 },
        { x: 1, y: -2 },
        { x: -1, y: -2 },
        { x: -2, y: -1 },
        { x: -2, y: 1 },
        { x: -1, y: 2 }
    ];

    // Get the knight's current position on the board in terms of grid coordinates
    const knightX = Math.floor(knight.x / squareSize);
    const knightY = Math.floor(knight.y / squareSize);

    // Check each possible 'L' move
    moves.forEach(move => {
        const newX = knightX + move.x;
        const newY = knightY + move.y;

        // Check if the new position is within the bounds of the board
        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            // Check if the move is to an empty square or captures an enemy piece
            if (!isPieceAt(newX, newY)) {
                // No piece at the new position, so it's a valid move
                possibleMoves.push([newX, newY]);
            } else if (isEnemyAt(newX, newY, knight.color)) {
                // Enemy piece at the new position, so it's a valid attack
                possibleMovesToEnemy.push([newX, newY]);
            }
        }
    });
}
