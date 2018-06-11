var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3309',
  user: 'root',
  password: '123456',
  database: 'RUNOOB'
})

connection.connect();

var sql = 'select * from websites';

//查
connection.query(sql, function (err, result) {
  if (err) {
    console.log('[SELECT ERROR] - ',err.message);
    return false;
  }

  console.log('--------------------------SELECT----------------------------')
  console.log(result)
  console.log('------------------------------------------------------------\n\n')
})