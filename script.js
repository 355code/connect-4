let GRID_SIZE = 30;
let PIECE_COLOR = "red";
let GAME = [];
let ANIMATING = false;
let WINNING_ARRAYS = [];
let RIGHT_EDGE = [6, 13, 20, 27, 34, 41];
let BOTTOM_EDGE = [35, 36, 37, 38, 39, 40, 41];

const background = document.createElement("div");
const board = document.createElement("div");

background.style.backgroundColor = "rgba(255, 255, 255, 0)";
document.body.appendChild(background);

function findWinningArrays(gameSize) {
  for (let i = 0; i < gameSize; i++) {
    [1, 7, 8, 6].forEach((increment) => {
      buildWinningArray(i, increment);
    });
  }
  console.log(WINNING_ARRAYS);
}

function buildWinningArray(base, increment) {
  let winningArray = [];
  for (let j = 0; j < 4; j++) {
    let toPush = base + j * increment;
    toPush < 42 //exit if bigger than 42
      ? j === 3
        ? winningArray.push(toPush) //always push if last in array
        : !RIGHT_EDGE.includes(toPush) && !BOTTOM_EDGE.includes(toPush)
        ? winningArray.push(toPush) //if not part of bottom or right edge push
        : BOTTOM_EDGE.includes(base)
        ? winningArray.push(toPush) // if base is bottom edge push
        : null
      : null;
  }
  if (winningArray.length === 4) {
    WINNING_ARRAYS.push(winningArray);
  }
}

function gameLogic(gameSize) {
  let column = 1;
  for (let i = 0; i < gameSize; i++) {
    if (column > 7) {
      column = 1;
    }
    let gridBox = {
      id: i,
      row: Math.floor(i / 7) + 1,
      column: column,
      color: "blank",
    };
    column++;
    GAME.push(gridBox);
  }
}

function createGame(columns, rows) {
  gameLogic(columns * rows);
  findWinningArrays(columns * rows);

  const boardStyles = {
    backgroundColor: "rgba(255, 255, 255, 0)",
    border: "solid",
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, ${GRID_SIZE}px)`,
    gridTemplateRows: `repeat(${rows}, ${GRID_SIZE}px)`,
    gap: "2px",
    height: "fit-content",
    width: "fit-content",
    justifyItems: "center",
    alignItems: "center",
    marginTop: "100px",
    //mixBlendMode: 'hard-light'
  };

  Object.keys(boardStyles).forEach((key) => {
    board.style[key] = boardStyles[key];
  });

  background.appendChild(board);

  for (let i = 0; i < columns * rows; i++) {
    const gridBox = document.createElement("div");
    const gridBoxStyles = {
      backgroundColor: "rgba(255, 255, 255, 0)",
      border: "solid",
      borderWidth: "2px",
      overflow: "hidden",
      height: `${GRID_SIZE}px`,
      width: `${GRID_SIZE}px`,
    };
    gridBox.setAttribute("id", "gridBox-" + i);
    Object.keys(gridBoxStyles).forEach((key) => {
      gridBox.style[key] = gridBoxStyles[key];
    });

    board.appendChild(gridBox);

    const gridBoxHole = document.createElement("div");
    const gridBoxHoleStyles = {
      backgroundColor: "rgba(255, 255, 255, 0)",
      transform: `translate(-${GRID_SIZE / 3}px,-${GRID_SIZE / 3}px)`,
      border: "solid",
      color: "blue",
      borderWidth: `${GRID_SIZE / 2}px`,
      height: `${(GRID_SIZE * 2) / 3}px`,
      width: `${(GRID_SIZE * 2) / 3}px`,
      textAlign: "center",
      borderRadius: "50%",
    };
    Object.keys(gridBoxHoleStyles).forEach((key) => {
      gridBoxHole.style[key] = gridBoxHoleStyles[key];
    });

    gridBox.appendChild(gridBoxHole);

    addMouseOverListener(gridBox);
  }
}

function addMouseOverListener(gridBox) {
  gridBox.addEventListener("mouseover", (event) => {
    handleMouseover(gridBox);
  });
}

function handleMouseover(gridBox) {
  if (!ANIMATING) {
    let currentColumn = Number(gridBox.getAttribute("id").substring(8)) + 1;
    if (currentColumn <= 7 && background.children.length === 1) {
      let newPiece = createPiece(gridBox, PIECE_COLOR);
      newPiece.style.zIndex = "-1";

      const handleClick = () => {
        gridBox.removeEventListener("click", handleClick);
        ANIMATING = true;
        let tempPieceColor = PIECE_COLOR;
        if (PIECE_COLOR === "red") {
          PIECE_COLOR = "yellow";
        } else {
          PIECE_COLOR = "red";
        }

        let keyframes = [{ transform: `translateY(${GRID_SIZE * 6}px)` }];

        let options = {
          duration: 1000,
        };
        newPiece.animate(keyframes, options);

        const columnArray = GAME.filter(
          (gridBox) => gridBox.column === currentColumn
        );
        for (let i = 5; i >= 0; i--) {
          if (columnArray[i].color === "blank") {
            const id = columnArray[i].id;
            GAME[id].color = tempPieceColor;
            checkForWin(tempPieceColor);
            setTimeout(() => {
              const gridBoxHoleToUpdate = document.getElementById(
                "gridBox-" + id
              ).children[0];
              gridBoxHoleToUpdate.style.backgroundColor = tempPieceColor;
              background.removeChild(newPiece);
              ANIMATING = false;
            }, i * 170);

            return;
          }
        }
      };

      gridBox.addEventListener("mouseout", () => {
        if (background.children[1] === newPiece) {
          if (!ANIMATING) {
            background.removeChild(newPiece);
          }
        }
        gridBox.removeEventListener("click", handleClick);
      });

      gridBox.addEventListener("click", handleClick);
    }
  }
}

function checkForWin(color) {
  WINNING_ARRAYS.forEach((arr) => {
    let win = 0;
    arr.forEach((num) => {
      if (GAME[num].color === color) {
        win++;
      }
      if (win === 4) {
          const gridBoxs = board.children
          for(let i = 0; i < gridBoxs.length; i++){
              gridBoxs[i].removeEventListener("mouseover", handleMouseover);
          }
        let winMessage = document.createElement('p');
        winMessage.innerHTML = `Game Over! ${color} wins!`;
        document.body.append(winMessage)  
      }
    });
  });
}

function createPiece(gridBox, color) {
  let startX = gridBox.getBoundingClientRect().left;
  let startY = gridBox.getBoundingClientRect().top;
  const piece = document.createElement("div");
  const pieceStyles = {
    position: "absolute",
    top: startY - 20 + "px",
    left: startX + GRID_SIZE / 6 + "px",
    border: "solid",
    height: `${(GRID_SIZE * 2) / 3}px`,
    width: `${(GRID_SIZE * 2) / 3}px`,
    textAlign: "center",
    borderRadius: "50%",
    backgroundColor: color,
  };
  // piece.setAttribute('id', 'piece-' + i)
  Object.keys(pieceStyles).forEach((key) => {
    piece.style[key] = pieceStyles[key];
  });

  background.appendChild(piece);

  return piece;
}

createGame(7, 6);
