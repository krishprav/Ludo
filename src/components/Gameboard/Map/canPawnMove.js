const canPawnMove = (pawn, rolledNumber) => {
    if ((rolledNumber === 1 || rolledNumber === 6) && pawn.position === pawn.basePos) {
        return true;
    } else if (pawn.position !== pawn.basePos) {
        switch (pawn.color) {
            case 'red':
                if (pawn.position + rolledNumber <= 73) return true;
                break;
            case 'blue':
                if (pawn.position + rolledNumber <= 79) return true;
                break;
            case 'green':
                if (pawn.position + rolledNumber <= 85) return true;
                break;
            case 'yellow':
                if (pawn.position + rolledNumber <= 91) return true;
                break;
            default:
                return false;
        }
    } else {
        return false;
    }
};
export default canPawnMove;