const mongoose = require('mongoose');

const dbConnection =  async() => {
    try {
        await mongoose.connect(process.env.DB_CONN);
        console.log('Db online');
    } catch (error) {
        console.log(error);
        throw new Error('Error when starting databse');
    }
}

module.exports = {
    dbConnection
}