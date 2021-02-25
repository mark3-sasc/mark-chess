interface Player {
  name: string;
  id: string;
}

enum GameState {
  PENDING,
  STARTED,
  FINISHED
}

interface Game {
  board: boolean[][];
  id: string;
  lastMoveTime: number;
  xMovesNext: boolean;
  players: Player[];
  state: GameState;
}

interface ErrorResponse {
  error: string;
}

interface GameCheckRequest {
  gameId: string;
  playerId: string;
}

interface GameCheckResponse {
  board: boolean[][];
  lastMoveTime: number;
  otherPlayerName: string;
  state: GameState;
  yourMove: boolean;
  yourSign: string;
}

interface JoinRequest {
  playerName: string;
}

interface JoinResponse {
  board: boolean[][];
  gameId: string;
  otherPlayerName: string;
  playerId: string;
  state: GameState;
  yourMove: boolean;
  yourSign: string;
}

interface MoveRequest {
  gameId: string;
  move: {
    column: number;
    row: number;
  };
  playerId: string;
}

interface MoveResponse {
  board: boolean[][];
  state: GameState;
}

interface MyGame {
  game: Game;
  myMove: boolean;
  mySign: string;
  otherPlayerName: string;
  playerId: string;
}

var myGame: MyGame;

export var basicVar = "basic";

var tdElements = document.getElementsByTagName("TD");

var joinButton = document.getElementById("join");

var winningConditions = [
  [{ row: 0, column: 0 }, { row: 1, column: 0 }, { row: 2, column: 0 }],
  [{ row: 0, column: 1 }, { row: 1, column: 1 }, { row: 2, column: 1 }],
  [{ row: 0, column: 2 }, { row: 1, column: 2 }, { row: 2, column: 2 }],
  [{ row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 }],
  [{ row: 1, column: 0 }, { row: 1, column: 1 }, { row: 1, column: 2 }],
  [{ row: 2, column: 0 }, { row: 2, column: 1 }, { row: 2, column: 2 }],
  [{ row: 0, column: 0 }, { row: 1, column: 1 }, { row: 2, column: 2 }],
  [{ row: 0, column: 2 }, { row: 1, column: 1 }, { row: 0, column: 2 }]
];

var checkIntervalId;

function whoWon() {
  for (var winningCondition of winningConditions) {
    var winningValue = whoWonACondition(winningCondition);
    if (winningValue) {
      return winningValue;
    }
  }
  return null;
}

function whoWonACondition(winningCondition) {
  var firstCell = winningCondition[0];
  var firstValue = myGame.game.board[firstCell.row][firstCell.column];
  for (var i = 1; i < winningCondition.length; i++) {
    var nextCell = winningCondition[i];
    var nextValue = myGame.game.board[nextCell.row][nextCell.column];
    if (firstValue !== nextValue) {
      return null;
    }
  }
  return firstValue;
}

for (var tdElement of tdElements) {
  tdElement.addEventListener("click", handleClick);
}

joinButton.addEventListener("click", join);

function join(event) {
  var playerNameText: HTMLInputElement = document.getElementById(
    "playerName"
  ) as any;

  var enterDiv: HTMLElement = document.getElementById("enter") as any;

  var waitingDiv: HTMLElement = document.getElementById("waiting") as any;

  var gameDiv: HTMLElement = document.getElementById("game") as any;

  var myNameSpan: HTMLElement = document.getElementById("myName") as any;
  myNameSpan.innerText = playerNameText.value;

  put("join", {
    playerName: playerNameText.value
  }).then((response: JoinResponse) => {
    if (((response as any) as ErrorResponse).error) {
      alert((response as any).error);
      return;
    }
    switch (response.state) {
      case GameState.STARTED: {
        waitingDiv.classList.add("hidden");
        gameDiv.classList.remove("hidden");
        break;
      }
      case GameState.PENDING: {
        break;
      }
      default: {
        alert(`GameState: ${response.state}`);
        return;
      }
    }

    checkIntervalId = setInterval(() => {
      if (myGame.myMove) {
        return;
      }

      if (!myGame.playerId || !myGame.game.id) {
        return;
      }

      put("check", {
        gameId: myGame.game.id,
        playerId: myGame.playerId
      } as GameCheckRequest).then((response: GameCheckResponse) => {
        if (((response as any) as ErrorResponse).error) {
          clearInterval(checkIntervalId);
          alert((response as any).error);
          enterDiv.classList.remove("hidden");
          gameDiv.classList.add("hidden");
          waitingDiv.classList.add("hidden");
          return;
        }
        switch (response.state) {
          case GameState.STARTED: {
            waitingDiv.classList.add("hidden");
            gameDiv.classList.remove("hidden");
            break;
          }
          case GameState.FINISHED: {
            clearInterval(checkIntervalId);
            alert("Game Over!");
            break;
          }
        }
        myGame.myMove = response.yourMove;
        myGame.otherPlayerName = response.otherPlayerName;
        var otherPlayerNameDiv: HTMLElement = document.getElementById(
          "otherPlayerName"
        ) as any;
        otherPlayerNameDiv.innerText = myGame.otherPlayerName;

        var game = myGame.game;
        game.board = response.board;
        game.lastMoveTime = response.lastMoveTime;
        game.state = response.state;

        var board = game.board;
        for (var rowIndex = 0; rowIndex < board.length; rowIndex++) {
          var row = board[rowIndex];
          for (var columnIndex = 0; columnIndex < row.length; columnIndex++) {
            var cellValue = row[columnIndex];
            var cellTd = document.querySelector(
              `tr[rowindex="${rowIndex}"] > td[columnIndex="${columnIndex}"]`
            );
            cellTd.innerHTML = cellValue === null ? "" : cellValue ? "X" : "O";
            if (cellValue !== null) {
              if (!cellTd.classList.contains(cellValue ? "X" : "O")) {
                cellTd.classList.add(cellValue ? "X" : "O");
              }
            }
          }
        }

        var now = new Date().getTime();
        if (now - 60 * 60 * 1000 < myGame.game.lastMoveTime) {
          clearInterval(checkIntervalId);
          alert("Game timed out");
          enterDiv.classList.remove("hidden");
          gameDiv.classList.add("hidden");
          waitingDiv.classList.add("hidden");
        }
      });
    }, 3000);

    myGame = {
      game: {
        board: response.board,
        id: response.gameId,
        lastMoveTime: new Date().getTime(),
        players: null,
        state: response.state,
        xMovesNext: null
      },
      myMove: response.yourMove,
      mySign: response.yourSign,
      otherPlayerName: response.otherPlayerName,
      playerId: response.playerId
    };
    // alert(JSON.stringify(myGame, null, 5));
  });
  enterDiv.classList.add("hidden");

  waitingDiv.classList.remove("hidden");
}

function handleClick(event) {
  if (!myGame.myMove) {
    // its the other player's move
    return;
  }

  var targetTd: HTMLTableCellElement = event.target;

  var rowIndex = parseInt(targetTd.parentElement.getAttribute("rowIndex"));
  var columnIndex = parseInt(targetTd.getAttribute("columnIndex"));

  if (myGame.game.board[rowIndex][columnIndex]) {
    // There is already a value on the board
    return;
  }

  var value = myGame.mySign;

  myGame.game.board[rowIndex][columnIndex] =
    myGame.mySign === "X" ? true : false;

  targetTd.innerHTML = value;
  targetTd.classList.add(value);

  put("move", {
    gameId: myGame.game.id,
    move: {
      column: columnIndex,
      row: rowIndex
    },
    playerId: myGame.playerId
  } as MoveRequest).then((response: MoveResponse) => {
    if (((response as any) as ErrorResponse).error) {
      alert((response as any).error);
      return;
    }
    myGame.game.board = response.board;
    myGame.game.state = response.state;
    myGame.myMove = false;
    switch (response.state) {
      case GameState.FINISHED: {
        alert("Game Over!");
        break;
      }
    }
  });

  var winningValue = whoWon();
  if (winningValue !== null) {
    clearInterval(checkIntervalId);
    alert('The "' + (winningValue ? "X" : "O") + '"s have won!');
  }
}

async function put<T>(url, data): Promise<T> {
  // Awaiting fetch which contains method,
  // headers and content-type and body
  const response = await fetch(
    "https://box.dataindependence.net:8080/tic-tac-toe/" + url,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "Referrer-Policy": "origin"
      },
      body: JSON.stringify(data)
    }
  );

  // Awaiting response.json()
  const resData = await response.json();

  // Return response data
  return resData as T;
}
