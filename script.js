let GRID_SIZE = 45;
let PIECE_COLOR = 'red';
let GAME = [];
let ANIMATING = false;

const background = document.createElement('div');
background.style.backgroundColor = 'rgba(255, 255, 255, 0)';
document.body.appendChild(background);


function gameLogic(gameSize) {
    let column = 1;
    for (let i = 0; i < gameSize; i++) {
        if(column > 7){
            column = 1;
        }
        let gridBox = {
            id: i,
            row: Math.floor(i/7) + 1,
            column: column,
            color: 'blank'
        }
        column++
        GAME.push(gridBox)
    }
}

function createGame(columns, rows) {

    gameLogic(columns * rows)
    const board = document.createElement('div');

    const boardStyles = {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        border: 'solid',
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, ${GRID_SIZE}px)`,
        gridTemplateRows: `repeat(${rows}, ${GRID_SIZE}px)`,
        gap: '2px',
        height: 'fit-content',
        width: 'fit-content',
        justifyItems: 'center',
        alignItems: 'center',
        marginTop: '100px',
        //mixBlendMode: 'hard-light'
    }

    Object.keys(boardStyles).forEach((key) => {
        board.style[key] = boardStyles[key];
    })

    background.appendChild(board);

    for (let i = 0; i < columns * rows; i++) {

        const gridBox = document.createElement('div');
        const gridBoxStyles = {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            border: 'solid',
            borderWidth: '2px',
            overflow: 'hidden',
            height: `${GRID_SIZE}px`,
            width: `${GRID_SIZE}px`
        }
        gridBox.setAttribute('id', 'gridBox-' + i)
        Object.keys(gridBoxStyles).forEach((key) => {
            gridBox.style[key] = gridBoxStyles[key];
        })

        board.appendChild(gridBox)

        const gridBoxHole = document.createElement('div');
        const gridBoxHoleStyles = {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            transform: `translate(-${GRID_SIZE / 4}px,-${GRID_SIZE / 4}px)`,
            border: 'solid',
            color: 'blue',
            borderWidth: '20px',
            height: '30px',
            width: '30px',
            textAlign: 'center',
            borderRadius: '50%'

        }
        Object.keys(gridBoxHoleStyles).forEach((key) => {
            gridBoxHole.style[key] = gridBoxHoleStyles[key];
        })

        gridBox.appendChild(gridBoxHole)


        dropPiece(gridBox);

    }
}

function dropPiece(gridBox) {
    gridBox.addEventListener('mouseover', () => {
        if(!ANIMATING){
        let currentColumn = Number(gridBox.getAttribute('id').substring(8)) + 1;
        if (currentColumn <= 7 && background.children.length === 1) {
            let newPiece = createPiece(gridBox, PIECE_COLOR);
            newPiece.style.zIndex = '-1';

            const handleClick = ()=>{
                gridBox.removeEventListener('click', handleClick)
                ANIMATING = true;
                let tempPieceColor = PIECE_COLOR;
                if (PIECE_COLOR === 'red') {
                    PIECE_COLOR ='yellow'
                }
                else {
                    PIECE_COLOR = 'red'
                }
                
                let keyframes = [
                    { transform: `translateY(${GRID_SIZE * 6}px)` }
                ]

                let options = {
                    duration: 1000
                }
                newPiece.animate(keyframes, options);

                const columnArray = GAME.filter((gridBox)=> gridBox.column === currentColumn);
                for(let i = 5; i >= 0; i--){
                    if(columnArray[i].color === 'blank'){
                        const id = columnArray[i].id
                        GAME[id].color = tempPieceColor;
                        setTimeout(()=>{
                            const gridBoxHoleToUpdate = document.getElementById('gridBox-' + id).children[0];
                            gridBoxHoleToUpdate.style.backgroundColor = tempPieceColor;
                            background.removeChild(newPiece);
                            ANIMATING = false;
                        },i*170)
                        
                        return
                    }
                }

            }

            gridBox.addEventListener('mouseout', () => {
                if (background.children[1] === newPiece) {
                    if(!ANIMATING){
                    background.removeChild(newPiece);
                    }
                }
                gridBox.removeEventListener('click', handleClick)
            })

            gridBox.addEventListener('click', handleClick)



        }
    }
    })
}

function createPiece(gridBox, color) {
    let startX = gridBox.getBoundingClientRect().left;
    let startY = gridBox.getBoundingClientRect().top;
    const piece = document.createElement('div');
    const pieceStyles = {
        position: 'absolute',
        top: startY - 20 + 'px',
        left: startX + GRID_SIZE / 6 + 'px',
        border: 'solid',
        height: '30px',
        width: '30px',
        textAlign: 'center',
        borderRadius: '50%',
        backgroundColor: color,
    }
    // piece.setAttribute('id', 'piece-' + i)
    Object.keys(pieceStyles).forEach((key) => {
        piece.style[key] = pieceStyles[key];
    })

    background.appendChild(piece)

    return piece;
}

createGame(7, 6)
