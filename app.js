var ws = require('nodejs-websocket')
var server = ws.createServer(function (conn) {
  console.log('New connection')
  conn.on('text', function (str) {
    console.log(str)
    // conn.sendText(str)
    // broadcast(str)
    var data = JSON.parse(str)
    switch (data.type) {
      case 'setname':
        conn.nickname = data.name;
        broadcast(JSON.stringify({
          name: 'Server',
          text: conn.nickname + '加入了房间'
        }))
        break;
      case 'chat':
        broadcast(JSON.stringify({
          name: conn.nickname,
          text: data.text
        }));
        break;
        
      default:
        break;
    }
  })
  conn.on('error', function (err) {
    console.log(err)
  })

  conn.on('close', function () {
    // console.log(111)
    broadcast(JSON.stringify({
      name: 'Server',
      text: conn.nickname + '离开了房间'
    }))
  })
  // setTimeout(function () {
  //   conn.sendText('来自服务端的消息')
  // }, 1200)
}).listen(2333);

function broadcast(msg) {
  server.connections.forEach(function (conn) {
    conn.sendText(msg)
  })
}