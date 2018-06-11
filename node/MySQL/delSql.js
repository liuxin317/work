var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3309',
  user: 'root',
  password: '123456',
  database: 'runoob'
});

connection.connect();

var delSql = 'delete from websites where id=?';
var delSqlparams = [6];

connection.query(delSql, delSqlparams, function (err, result) {
  if (err) {
    console.log('err: ' + result);
    return false;
  }

  console.log('--------------------------DELETE----------------------------');
  console.log('DELETE affectedRows',result.affectedRows);
  console.log('-----------------------------------------------------------------\n\n');
});

connection.end();