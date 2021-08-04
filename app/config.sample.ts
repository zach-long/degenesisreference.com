// the app requires a config.ts file with these values
// the file should be created securely on the production server so as to secure information that should be protected
// the 'admin' values below are used by the script createAdminUser.ts to generate an admin user off-app
// in addition to this file, a .env file needs created with the values required by this file such as PORT and ENV
module.exports.secret = ''
module.exports.port = process.env.PORT || '';
module.exports.dbPath = process.env.ENV == 'production' ? process.env.MONGODB_URI_PROD : '';
module.exports.adminName = '';
module.exports.adminUsername = '';
module.exports.adminPassword = '';
module.exports.adminEmail = '';
