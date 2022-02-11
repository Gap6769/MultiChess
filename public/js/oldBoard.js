
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var possitionFen = game.fen()


// config for drag and drop freely
function dragAndDrop(posFen) {
    var freelyConfig = {
        draggable: true,
        dropOffBoard: 'trash',
        sparePieces: true,
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
        sparePieces: true,
    }
    return configLegalOnly
}

var SomeVar = SomeVar || 'Default Value';
if (typeof variable === 'undefined') {
    // variable is undefined
    // eg:
    // var variable = "someValue";
}


// function to check if the move is legal and update

function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

function onDrop(source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'

    updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
    board.position(game.fen())
}

function updateStatus() {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }
    possitionFen = game.fen()
    $status.html(status)
    $fen.html(game.fen())
    $pgn.html(game.pgn())
    return possitionFen
}
function clickShowPositionBtn() {
    var position = game.fen()
    console.log('Current position as a FEN string:')
    console.log(position)
    localStorage.setItem('fen', position)
}



function rotateView() {
    $('#whiteBlack').on('click', function () {
        $('#fwhiteBlackCheck').prop('checked', false)
        board.flip()
    })
}
possitionFen = game.fen()

// necesito ejecutar el siguiente bloque de codigo cuando cargue la pagina
board = ChessBoard('myBoard', legalOnly('start'))
//game.load(possitionFen)
possitionFen = game.fen() // esto tiene que ir como argumento
updateStatus()
$('#startBtn').on('click', board.start)
$('#clearBtn').on('click', board.clear)
$('#showPositionBtn').on('click', clickShowPositionBtn)

//si hago return aca, pasa a la funcion de abajo? o como hago para pasar possitionFen al siguiente bloque de codigo????
// a partir de aca que sea en el on click de legalMoves, pero que el bloque siguiente sea parte de lo mismo, o algo asi, ndeah 

$('#legalMoves').on('click', function () {

    game.load(possitionFen)
    if ($('#legalMoves').prop('checked') === true) {
        console.log('legal moves')

        board = ChessBoard('myBoard', legalOnly(possitionFen))
        game.load(possitionFen)

        $('#showPositionBtn').on('click', clickShowPositionBtn)
        updateStatus()
        //return possitionFen

        //game.load(possitionFen)

    }
    else {
        console.log('freely')
        board = ChessBoard('myBoard', dragAndDrop(possitionFen))
        game.load(possitionFen)
        return updateStatus()

        $('#showPositionBtn').on('click', clickShowPositionBtn)
        $('#startBtn').on('click', board.start)
        //return possitionFen


    }
})




rotateView()

