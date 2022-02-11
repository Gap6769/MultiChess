

var game = new Chess();

var board = Chessboard('myBoard', {
  draggable: true,
  dropOffBoard: 'trash',
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
})

$(window).resize(board.resize)

function dragAndDrop(posFen) {
  var freelyConfig = {
    draggable: true,
    dropOffBoard: 'trash',

    position: posFen
  }
  return freelyConfig
}

// config for drag and drop only legal moves
function legalOnly(posFen = possitionFen) {
  var configLegalOnly = {
    draggable: true,
    position: posFen,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    dropOffBoard: 'trash',

  }
  return configLegalOnly
}

// start btn 
document.querySelector('#setStartBtn').addEventListener('click', () => {
  board.start();
});

// turn board white - black
$('#whiteBlack').on('click', function () {
  $('#fwhiteBlackCheck').prop('checked', false)
  board.flip()
})


// highlight the legal moves of the piece 
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare(square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart(source, piece) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // or if it's not that side's turn
  // if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
  //     (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
  //   return false
  // }
}

function onDrop(source, target) {
  removeGreySquares()

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  // if (move === null) return 'snapback'
}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares()
}

function onSnapEnd() {
  board.position(game.fen())
}

// Functions to get FEN and PGN from the chessboard api
function getFen() {
  return game.fen()
}

function getPGN() {
  return game.pgn()
}
// Function to load FEN into the game
function setFen(fen) {
  // update the chessboard visual
  game.load(fen)
  // update the board in the chess api (the logic)
  board.position(fen)
}
$('#generateFen').on('click', function () {
  console.log('FEN: ' + getFen())
  $('#fenExport').val(getFen())
  $('#pgnExport').val(getPGN())
})


$('#importFen').on('click', function () {
  fen = $('#fenInput').val()

  console.log(game.pgn())
  setFen(`${fen}`)

})


// esto no esta andando:

$('#legalMoves').on('click', function () {
  // evento que inicia al presionar el boton, imprimer el current fen en consola
  console.log('Start fen on click is' + game.fen())

  // si luego de apretarlo el boton esta marcado entonces ejecuta esto:
  if ($('#legalMoves').prop('checked') === true) {
    // asigna el fen actual a la variable current_fen
    current_fen = getFen()
    // imprime el fen
    console.log('legal moves fen is ' + current_fen)
    // Actualiza la api visual con el fen actual (legal only config y variable es la posicion start)
    board = ChessBoard('myBoard', legalOnly(current_fen))
    // actualiza la api de logica con el fen actual
    game.load(current_fen)

  }
  // si luego del click el boton no esta marcado entonces ejecuta esto:
  else {
    // asigna el fen actual a la variable current_fen
    current_fen = getFen()
    console.log('freely')
    // actualiza la api visual con el fen actual (freely config y variable es la posicion start)
    board = ChessBoard('myBoard', dragAndDrop(current_fen))
    // actualiza la api de logica con el fen actual
    game.load(current_fen)
    // log de fen actual (este no se actualiza, por lo que al volver a solo movimientos legales
    // se mantiene el fen anterior, es decir la partida no avanza.)
    console.log('drag and drop fen is:' + current_fen)



  }
})