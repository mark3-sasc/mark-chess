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

var board = {
  A: {
    1: "♖",
    2: "♙",
    7: "♟",
    8: "♜"
  },
  B: {
    1: "♘",
    2: "♙",
    7: "♟",
    8: "♞"
  },
  C: {
    1: "♗",
    2: "♙",
    7: "♟",
    8: "♝"
  },
  D: {
    1: "♕",
    2: "♙",
    7: "♟",
    8: "♛"
  },
  E: {
    1: "♔",
    2: "♙",
    7: "♟",
    8: "♚"
  },
  F: {
    1: "♗",
    2: "♙",
    7: "♟",
    8: "♝"
  },
  G: {
    1: "♘",
    2: "♙",
    7: "♟",
    8: "♞"
  },
  H: {
    1: "♖",
    2: "♙",
    7: "♟",
    8: "♜"
  }
};

for (var columnIndex in board) {
  for (var rowIndex in board[columnIndex]) {
    document.querySelector(
      `tr[rowIndex="${rowIndex}"] td[columnIndex=${columnIndex}]`
    ).innerHTML = board[columnIndex][rowIndex];
  }
}

var myGame: MyGame;

export var basicVar = "basic";

var tdElements = document.getElementsByTagName("TD");

var joinButton = document.getElementById("join");

var checkIntervalId;

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

  enterDiv.classList.add("hidden");

  waitingDiv.classList.remove("hidden");
}

function handleClick(event) {}

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
