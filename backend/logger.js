const fs = require('fs');
const path = require('path');
const os = require('os');

const logger = {};

logger.logDir = 'logs';
logger.logFiles = {};

logger.checkLogDir = function () {
    const dirname = path.join(logger.logDir);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname);
};

logger.createLogWriter = function (file) {
    logger.logFiles[file] = fs.createWriteStream(path.join(logger.logDir, file + '.log'));
};

logger.log = function (file, data) {
    if (!logger.logFiles[file]) {
        logger.createLogWriter(file);
    }
    logger.logFiles[file].write(data + os.EOL);
};

module.exports = function () {
    logger.checkLogDir();
    return logger.log;
};
