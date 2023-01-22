const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose
    .connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!'));

  console.log('MongoDB Connected');
};

module.exports = connectDB;
