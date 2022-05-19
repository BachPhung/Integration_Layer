import app from "./app";
import http from 'http';
import config from "./util/config";

const server = http.createServer(app);
const PORT = config.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})