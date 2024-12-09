let exec = require('child_process').exec
var http = require('http'); 
var https = require('https'); 
const fs = require('fs');
const { disconnect } = require('process');
var cheerio = require('cheerio');
var request = require('request');
var iconv = require("iconv-lite");
const { encode } = require('punycode');

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
  }else if(url == "/discountData"){
    discountData(request,res)
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
    let today = getDate()
    today=today.replaceAll(".","_")
    today=today.replaceAll(" ","")
    console.log(today)
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
    console.log(body.id)
    result = await getSiteSummary(body.id)
    
    res.setHeader('Content-Type', 'application/json charset=utf-8')
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(result))
  })
}
function discountData(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', async function() {
    body=JSON.parse(body)
    result = await getSitePriceGroup(body.id)
    
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
function fetchHtml(options) {
  return new Promise((resolve, reject) => {
      https.get(options, (res) => {
          let data = '';

          // 데이터 수신 중
          res.setEncoding(null);
          res.on('data', (chunk) => {
              data += chunk;
          });

          // 응답 완료
          res.on('end', () => {
              try {
                  resolve(data);
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
async function getSitePriceGroup(id){
  const options = {
    hostname: 'api-ticketfront.interpark.com',
    path: '/v1/goods/'+id+'/prices/group',
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
  result={}
  i=0
  for (seatsName in datas){
    seats=datas[seatsName]
    for (discounts in seats){
      discounts=seats[discounts]
      for(discountsN in discounts){
        discount=discounts[discountsN]
        result[i]=[discount["seatGradeName"],discount["priceGradeName"],discount["salesPrice"]]
        i++
      }
    }
  }
  return result
}
async function scheduleInfo(id){
  const options = {
    hostname: 'ticket.interpark.com',
    path: '/webzine/paper/TPNoticeView.asp?bbsno=34&pageno=1&stext=%C0%CC%C1%D8%C8%A3&no=53614&groupno=53614&seq=0&KindOfGoods=TICKET&Genre=&sort=WriteDate',
    method: 'GET',
    encoding:null
  };
  const datas = await fetchHtml(options, (error, data) => {
    if (error) {
        console.error('요청 실패:', error);
    } else {
        console.log('받은 데이터:', data);
    }
});

  data=iconv.encode(datas, 'utf8');
  data=iconv.decode(datas, 'euc-kr');
  console.log("work",data)
}
async function scheduleInfo2(id){
  url="https://ticket.interpark.com/webzine/paper/TPNoticeView.asp?bbsno=34&pageno=1&stext=%C0%CC%C1%D8%C8%A3&no=53614&groupno=53614&seq=0&KindOfGoods=TICKET&Genre=&sort=WriteDate"
  html=request({url,encoding:null}, function(error, response, html){
    if (error) {throw error};
    const content = iconv.decode(html, 'euc-kr');
    var $ = cheerio.load(content);

    $infos =$('.info').children("ul").children("li")
    $infos.each(function(){
      console.log($(this).text())
    })
  });
}
async function scheduleInfo3(id){
  url="https://ticket.interpark.com/webzine/paper/TPNoticeView.asp?bbsno=34&pageno=1&stext=%C0%CC%C1%D8%C8%A3&no=53614&groupno=53614&seq=0&KindOfGoods=TICKET&Genre=&sort=WriteDate"
  const res = await fetch(url)
    buff= await res.arrayBuffer();
    const decoder = new TextDecoder('euc-kr'); //utf-8로도 바꿔보고.., euc-kr로도 바꿔보고..
    const text = decoder.decode(buff);
    
    var $ = cheerio.load(text);
    $infos =$('.info').children("ul").children("li")

    var openInfo=[]
    $infos.each(function(){
      console.log($(this).text())
    })
}
// getSiteSummary()
// getSitePriceGroup(24016737)


//~~~~~~~~~Util~~~~
function getDate(){
let today = new Date();   

// let year = today.getFullYear(); // 년도
// let month = today.getMonth() + 1;  // 월
// let date = today.getDate();  // 날짜
// let day = today.getDay();  // 요일
// dates=[year,month,date,day]
return today.toLocaleDateString('ko-KR')
}


scheduleInfo3()