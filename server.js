import config from './config/config.js';
import app from './server/express.js';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(`unable to connect to database: ${config.mongoUri}`);
  });

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info('Server started on port %s.', config.port);
});
