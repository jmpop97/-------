var http = require('http'); 
const fs = require('fs');
var initList
var server = http.createServer(function(request,res){ 
  url=request.url
  if (url =="/saveInit"){
    saveJson(request,res)
  }else if(url == "/initList"){
    initList(request,res)
  }else if(url == "/loadInit"){
    loadInit(request,res)
  }else if(true){
  }else if(true){
  }else if(true){
  }
  
});

// 3. listen 함수로 8080 포트를 가진 서버를 실행한다. 서버가 실행된 것을 콘솔창에서 확인하기 위해 'Server is running...' 로그를 출력한다
server.listen(8080, function(){ 
  console.log('Server is running...');
});

function saveJson(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', function() {
    body=JSON.parse(body)
    let json = JSON.stringify(body,null,2);
    let today = new Date();   
    today=today.toLocaleDateString()
    today=today.split('/').join('')
    today = today.substr(2)
    path="./initData/"+today+" - "+body.title+".json"
    try {
        fs.writeFileSync(path, json);
      } catch (error) {
        console.log(error)
      }

    res.setHeader('Content-Type', 'application/json charset=utf-8')
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end("hi")
  })



}

function initList(request,res){
  dir="./InitData"
  filelists=fs.readdirSync(dir)
  res.setHeader('Content-Type', 'application/json charset=utf-8')
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(filelists))
}

function loadInit(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', function() {
    body=JSON.parse(body)
    const jsonFile = fs.readFileSync('./InitData/'+body.fileName, 'utf8');
    res.setHeader('Content-Type', 'application/json charset=utf-8')
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(jsonFile)
  })
}