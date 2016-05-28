import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import router from './router';

const app = express();

let port = 8000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 경로 '/' 로 들어오는 요청들은 public 폴더로 정적 라우팅합니다.
app.use(express.static(__dirname + '/../public'));
app.use('/', router);

const server = app.listen(port, () => {
  console.log('Express listening on port', port);
});
