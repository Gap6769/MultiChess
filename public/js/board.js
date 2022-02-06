
const game = new Chess();

var board = Chessboard('myBoard', {
    draggable: true,
    dropOffBoard: 'trash',
    position: 'start',
})

document.querySelector('#setStartBtn').addEventListener('click', () => {
    board.start();
});
