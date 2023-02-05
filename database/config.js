const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Esto fue un warning suguerido

const dbConnection = async() => {
    try {

        await mongoose.connect(process.env.DB_CNN);

        console.log('DB ONLINE');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar la BD');
    }
};

module.exports = {
    dbConnection
}