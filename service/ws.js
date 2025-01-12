
const setup_ws = (io) => {
    io.sockets.on('connection', sock => {

        sock.on('disconnect', () => {});
    });
};

module.exports = setup_ws