"use strict";
module.exports.secret = '';
module.exports.port = process.env.PORT || '';
module.exports.dbPath = process.env.ENV == 'production' ? process.env.MONGODB_URI_PROD : '';
module.exports.adminName = '';
module.exports.adminUsername = '';
module.exports.adminPassword = '';
module.exports.adminEmail = '';
