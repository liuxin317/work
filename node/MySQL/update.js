const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  port: '3309',
  user: 'root',
  password: '123456',
  database: 'RUNOOB'
});

connection.connect();

var modSql = 'UPDATE websites SET name=?, url=? WHERE id=?';
var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',6];

// 改
connection.query(modSql, modSqlParams, function (err, result) {
  if (err) {
    console.log('err:' + err.message);
    return false;
  }

  console.log('--------------------------UPDATE----------------------------');
  console.log('UPDATE affectedRows',result.affectedRows);
  console.log('-----------------------------------------------------------------\n\n');
})

connection.end();