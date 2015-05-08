'use strict';

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: 'mongodb://localhost/p2pclient-dev'
    },

    seedDB: true,
    serverPath:"http://10.100.9.85"
};
