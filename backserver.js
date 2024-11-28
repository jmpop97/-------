let exec = require('child_process').exec
var http = require('http'); 
var https = require('https'); 
const fs = require('fs');
const { disconnect } = require('process');

var initList
var server = http.createServer(function(request,res){ 
  url=request.url
  if (url =="/saveInit"){
    saveJson(request,res)
  }else if(url == "/initList"){
    initList(request,res)
  }else if(url == "/loadInit"){
    loadInit(request,res)
  }else if(url == "/productData"){
    productData(request,res)
  }
  
});

// 3. listen 함수로 8080 포트를 가진 서버를 실행한다. 서버가 실행된 것을 콘솔창에서 확인하기 위해 'Server is running...' 로그를 출력한다
server.listen(8080, function(){ 
  console.log('Server is running...');
});




//~~~~~~~~~~~~~~~~REST API function~~~~~~~~~~~~~
function saveJson(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', function() {
    body=JSON.parse(body)
    let json = JSON.stringify(body,null,2);
    console.log(json)
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
  console.log("spawnTest")
  dir="./InitData"
  filelists=fs.readdirSync(dir)
  res.setHeader('Content-Type', 'application/json charset=utf-8')
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(filelists.reverse()))
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
function productData(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', async function() {
    body=JSON.parse(body)
    result = await getSiteSummary(body.id)
    
    res.setHeader('Content-Type', 'application/json charset=utf-8')
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(result))
  })
}

//~~~~~~~~~~~~~~~~터미널~~~~~~~~~~~~~
function spawnTest() {
  exec('ls -al', (err,out,stderr) => { 
    console.log(out)
  });
}




//~~~~~~~~~~~~~~~~api~~~~~~~~~~~~~
function fetchJson(options) {
  return new Promise((resolve, reject) => {
      https.get(options, (res) => {
          let data = '';

          // 데이터 수신 중
          res.on('data', (chunk) => {
              data += chunk;
          });

          // 응답 완료
          res.on('end', () => {
              try {
                  const jsonData = JSON.parse(data);
                  resolve(jsonData);
              } catch (err) {
                  reject(new Error(`Failed to parse JSON from  ${err.message}`));
              }
          });
      }).on('error', (err) => {
          reject(new Error(`Failed to fetch data from  ${err.message}`));
      });
  });
}
async function getSiteSummary(id){
  console.log("summary",id)
  const options = {
    hostname: 'api-ticketfront.interpark.com',
    path: '/v1/goods/'+id+'/summary?goodsCode=24016412&priceGrade=&seatGrade=',
    method: 'GET',
    headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'ko-KR,ko;q=0.9',
        'priority': 'u=0, i',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    }
  }; 
  const datas= await fetchJson(options)
  console.log(datas)
  data=datas["data"]
  goodsName=data["goodsName"]
  placeName=data["placeName"]
  placeCode=data["placeCode"]
  specialSeatingName=data["specialSeatingName"] //단독판매
  return {
    goodsName,
    placeName,
    placeCode,
    specialSeatingName
  }
}
async function getSitePriceGroup(){
  const options = {
    hostname: 'api-ticketfront.interpark.com',
    path: '/v1/goods/24016412/prices/group',
    method: 'GET',
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'ko-KR,ko;q=0.9',
      'priority': 'u=0, i',
      'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  }
  };
  const datas= await fetchJson(options)
  for (seats in datas){
    seats=datas[seats]
    for (discounts in seats){
      discounts=seats[discounts]
      for(i in discounts){
        discount=discounts[i]
        console.log(discount["seatGradeName"],discount["priceGradeName"],discount["salesPrice"])
      }
    }
  }

}
// getSiteSummary()
getSitePriceGroup()