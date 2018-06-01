// 域名解析
var dns = require('dns');

dns.lookup('www.github.com', function (err, address, family) {
  console.log('IP地址：' + address);

  dns.reverse(address, function(err, hostname) {
    if (err) {
      return console.error(err.stack)
    }

    console.log('反向解析：' + address + ':' + JSON.stringify(hostname))
  })
})