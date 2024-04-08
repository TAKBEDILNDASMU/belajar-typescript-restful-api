"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = require("./app/web");
const logger_1 = require("./app/logger");
web_1.web.listen(3000, () => {
    logger_1.logger.info("Listening on port 3000");
});
