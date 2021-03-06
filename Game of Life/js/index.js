"use strict";

var board = [];
var width = 70;
var height = 50;
var cells = width * height;
var running = 0;
var delay = 50;
var generation = 0;
var ReactCell;

$(document).ready(function () {
  $(".gen").text("0");
  $(".population").text("0");
  clearBoard();
  initialSet();
  createBoard();
  activateBoard();
  running = 1;
  runIt();
});

function clearBoard() {
  board = [];
  for (var i = 0; i < cells; i++) {
    board[i] = { id: i, status: "cell dead" };
  }
  generation = 0;
  $(".gen").text("0");
};

function createBoard() {
  $("#container").empty();
  ReactCell = React.createClass({
    displayName: "ReactCell",

    getInitialState: function getInitialState() {
      return { cellBoard: board };
    },
    updateCells: function updateCells() {
      this.setState({ cellBoard: this.props.board });
    },
    render: function render() {
      return React.createElement(
        "div",
        null,
        this.props.board.map(function (cell, i) {
          return React.createElement("div", { className: cell.status, key: i, id: i });
        })
      );
    }
  });
  drawBoard();
}

function runGeneration() {
  var newBoard = [];
  var cellStatus = '';

  for (var i = 0; i < cells; i++) {
    newBoard.push({ id: i, status: "cell dead" });
    var check = cellCheck(i);

    if ((board[i].status == "cell alive" || board[i].status == "cell alive old") && (check == 3 || check == 2)) {
      newBoard[i] = { id: i, status: "cell alive old" };
    }
    if (board[i].status == "cell dead" && check == 3) {
      newBoard[i] = { id: i, status: "cell alive" };
    }
  };

  for (var i = 0; i < cells; i++) {
    if (board[i].status == "cell alive" || board[i].status == "cell alive old") {
      break;
    }
    if (i == cells - 1) {
      $(".clear").addClass('activeButton');
      setTimeout(function () {
        $(".clear").removeClass("activeButton");
      }, 400);
      running = 0;
      clearBoard();
      drawBoard();
    }
  }
  return newBoard;
};

function drawBoard(passedBoard) {
  ReactDOM.render(React.createElement(ReactCell, { board: board, generation: generation }), document.getElementById("container"));
}

function activateBoard() {
  $(".cell").click(function () {
    var cellNum = $(this).attr("id");
    if (board[cellNum].status == "cell alive" || board[cellNum].status == "cell alive old") {
      board[cellNum].status = "cell dead";
    } else {
      board[cellNum].status = "cell alive";
    }
    drawBoard();
    console.log(cellNum + " " + board[cellNum].status);
  });

  $(".clear").click(function () {
    $(".stop").removeClass("activeButton");
    $(".clear").addClass("activeButton");
    setTimeout(function () {
      $(".clear").removeClass("activeButton");
    }, 700);
    running = 0;
    generation = 0;
    clearBoard();
    drawBoard();
    $(".gen").text("0");
    $(".population").text("0");
  });

  $(".run").click(function () {
    $(".stop").removeClass("activeButton");
    $(".reset").removeClass("activeButton");
    $(".run").addClass("activeButton");
    setTimeout(function () {
      $(".run").removeClass("activeButton");
    }, 700);
    running = 1;
    runIt();
  });

  $(".stop").click(function () {
    $(".stop").addClass("activeButton");
    running = 0;
  });
};

function runIt() {
  if (running == 1) {
    setTimeout(function () {
      generation++;
      board = runGeneration();
      $(".gen").text(generation);
      setTimeout(function () {
        drawBoard();
        runIt();
      }, delay);
    }, 0);
  }
};

function cellCheck(i) {
  var count = 0;
  var borderCell = 0;

  if (i >= 0 && i <= width - 1) {
    borderCell = 1;
    var dif = width - i;

    if (board[cells - dif].status == "cell alive" || board[cells - dif].status == "cell alive old") {
      count++;
    }
    if (i != 0 && (board[cells - dif - 1].status == "cell alive" || board[cells - dif - 1].status == "cell alive old")) {
      count++;
    }
    if (i != width - 1 && (board[cells - dif + 1].status == "cell alive" || board[cells - dif + 1].status == "cell alive old")) {
      count++;
    }
    if (i != 0 && (board[i + width - 1].status == "cell alive" || board[i + width - 1].status == "cell alive old")) {
      count++;
    }
    if (board[i + width].status == "cell alive" || board[i + width].status == "cell alive old") {
      count++;
    }
    if (i != width - 1 && (board[i + width + 1].status == "cell alive" || board[i + width + 1].status == "cell alive old")) {
      count++;
    }
    if (i != 0 && (board[i - 1].status == "cell alive" || board[i - 1].status == "cell alive old")) {
      count++;
    }
    if (i != width - 1 && (board[i + 1].status == "cell alive" || board[i + 1].status == "cell alive old")) {
      count++;
    }
  }
  if (i >= cells - width && i <= cells - 1) {
    borderCell = 1;
    var dif = i + width - cells;

    if (board[dif].status == "cell alive" || board[dif].status == "cell alive old") {
      count++;
    }
    if (i != cells - width && (board[dif - 1].status == "cell alive" || board[dif - 1].status == "cell alive old")) {
      count++;
    }
    if (i != cells - 1 && (board[dif + 1].status == "cell alive" || board[dif + 1].status == "cell alive old")) {
      count++;
    }
    if (i != cells - width && (board[i - width - 1].status == "cell alive" || board[i - width - 1].status == "cell alive old")) {
      count++;
    }
    if (board[i - width].status == "cell alive" || board[i - width].status == "cell alive old") {
      count++;
    }
    if (i != cells - 1 && (board[i - width + 1].status == "cell alive" || board[i - width + 1].status == "cell alive old")) {
      count++;
    }
    if (i != cells - 1 && (board[i + 1].status == "cell alive" || board[i + 1].status == "cell alive old")) {
      count++;
    }
  }
  if ((i + 1) % width == 0) {
    borderCell = 1;

    if (board[i - width + 1].status == "cell alive" || board[i - width + 1].status == "cell alive old") {
      count++;
    }
    if (i != cells - 1 && (board[i + 1].status == "cell alive" || board[i + 1].status == "cell alive old")) {
      count++;
    }
    if (i == cells - 1 && (board[0].status == "cell alive" || board[0].status == "cell alive old")) {
      count++;
    }
    if (i > width && (board[i - width * 2 + 1].status == "cell alive" || board[i - width * 2 + 1].status == "cell alive old")) {
      count++;
    }
    if (i == width - 1 && (board[cells - width].status == "cell alive" || board[cells - width].status == "cell alive old")) {
      count++;
    }
    if (i != width - 1 && i != cells - 1 && (board[i - width].status == "cell alive" || board[i - width].status == "cell alive old")) {
      count++;
    }
    if (i != cells - 1 && i != width - 1 && (board[i + width].status == "cell alive" || board[i + width].status == "cell alive old")) {
      count++;
    }
    if (i != cells - 1 && i != width - 1 && (board[i + width - 1].status == "cell alive" || board[i + width - 1].status == "cell alive old")) {
      count++;
    }
    if (i != cells - 1 && i != width - 1 && (board[i - 1].status == "cell alive" || board[i - 1].status == "cell alive old")) {
      count++;
    }
    if (i != width - 1 && i != cells - 1 && (board[i - width - 1].status == "cell alive" || board[i - width - 1].status == "cell alive old")) {
      count++;
    }
    if (i == width - 1 && (board[cells - width - 1].status == "cell alive" || board[cells - width - 1].status == "cell alive old")) {
      count++;
    }
  }
  if (i % width == 0 || i == 0) {
    borderCell = 1;

    if (board[i + width - 1].status == "cell alive" || board[i + width - 1].status == "cell alive old") {
      count++;
    }
    if (i != cells - width && (board[i + width * 2 - 1].status == "cell alive" || board[i + width * 2 - 1].status == "cell alive old")) {
      count++;
    }
    if (i == cells - width && (board[width - 1].status == "cell alive" || board[width - 1].status == "cell alive old")) {
      count++;
    }
    if (i >= width && (board[i - 1].status == "cell alive" || board[i - 1].status == "cell alive old")) {
      count++;
    }
    if (i == 0 && (board[cells - 1].status == "cell alive" || board[cells - 1].status == "cell alive old")) {
      count++;
    }
    if (i != width + 1 && i != cells - width && i != 0 && (board[i - width].status == "cell alive" || board[i - width].status == "cell alive old")) {
      count++;
    }
    if (i < cells - width && i != 0 && (board[i + width].status == "cell alive" || board[i + width].status == "cell alive old")) {
      count++;
    }
    if (i != 0 && i != cells - width && (board[i - width + 1].status == "cell alive" || board[i - width + 1].status == "cell alive old")) {
      count++;
    }
    if (i != 0 && i != cells - width && (board[i + 1].status == "cell alive" || board[i + 1].status == "cell alive old")) {
      count++;
    }
    if (i < cells - width && i != 0) {
      if (board[i + width + 1].status == "cell alive" || board[i + width + 1].status == "cell alive old") {
        count++;
      }
    }
  }

  if (borderCell == 0) {
    if (board[i - width].status == "cell alive" || board[i - width].status == "cell alive old") {
      count++;
    }
    if (board[i - width - 1].status == "cell alive" || board[i - width - 1].status == "cell alive old") {
      count++;
    }
    if (board[i - width + 1].status == "cell alive" || board[i - width + 1].status == "cell alive old") {
      count++;
    }
    if (board[i - 1].status == "cell alive" || board[i - 1].status == "cell alive old") {
      count++;
    }
    if (board[i + 1].status == "cell alive" || board[i + 1].status == "cell alive old") {
      count++;
    }
    if (board[i + width].status == "cell alive" || board[i + width].status == "cell alive old") {
      count++;
    }
    if (board[i + width - 1].status == "cell alive" || board[i + width - 1].status == "cell alive old") {
      count++;
    }
    if (board[i + width + 1].status == "cell alive" || board[i + width + 1].status == "cell alive old") {
      count++;
    }
  }
  return count;
}

function initialSet() {
  for (var i = 0; i < cells; i++) {
    var schrodingersCell = Math.floor(Math.random() * 2);
    if (schrodingersCell === 0) {
      board[i] = { id: i, status: "cell alive old" };
    } else {
      board[i] = { id: i, status: "cell dead" };
    }
  }
};