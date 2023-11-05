    function showPossibleBishopMoves(bishop) {
        // Directions a bishop can move: diagonal lines in all four directions
        const directions = [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 }
        ];

        // Get the bishop's current position on the board in grid coordinates
        const bishopX = Math.floor(bishop.x / squareSize);
        const bishopY = Math.floor(bishop.y / squareSize);

        // Check each direction the bishop can move
        directions.forEach(direction => {
            let newX = bishopX + direction.x;
            let newY = bishopY + direction.y;

            // Continue in each direction until the end of the board or a piece is encountered
            while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                if (!isPieceAt(newX, newY)) {
                    // No piece at the new position, so it's a valid move
                    possibleMoves.push([newX, newY]);
                } else {
                    // Piece at the new position, check if it's an enemy
                    if (isEnemyAt(newX, newY, bishop.color)) {
                        // Enemy piece can be captured
                        possibleMovesToEnemy.push([newX, newY]);
                    }
                    // Bishop can't jump over pieces, so break out of the loop
                    break;
                }
                // Move to the next square in the diagonal direction
                newX += direction.x;
                newY += direction.y;
            }
        });
    }
