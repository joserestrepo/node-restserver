// Puerto
process.env.PORT = process.env.PORT || 3000;

//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//url base de datos
process.env.URL_DB = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe';