function showPossibleKingMoves(king) {
    const directions = [
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 }
    ];

    const kingX = Math.floor(king.x / squareSize);
    const kingY = Math.floor(king.y / squareSize);

    directions.forEach(direction => {
        let newX = kingX + direction.x;
        let newY = kingY + direction.y;

        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            if (!isPieceAt(newX, newY)) {
                possibleMoves.push([newX, newY]);
            } else if (isEnemyAt(newX, newY, king.color)) {
                possibleMovesToEnemy.push([newX, newY]);
            }
        }
    });
}
