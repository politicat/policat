import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import router from './router';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/politicat');

const app = express();

let port = 8000;
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../public'));
app.use('/', router);

const server = app.listen(port, () => {
  console.log('Express listening on port', port);
});
