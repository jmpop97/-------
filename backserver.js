let exec = require('child_process').exec
var http = require('http'); 
var https = require('https'); 
const fs = require('fs');
var cheerio = require('cheerio');

var initList
var server = http.createServer(function(request,res){ 
  try {
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
    }else if(url == "/alertData"){
      alertData(request,res)
    }
    
  } catch (error) {
    
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
function alertData(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', async function() {
    body=JSON.parse(body)
    try {
      result = await scheduleInfo(body.url)
    }catch{
      result ={}
    }
    
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
                  
              }
          });
      }).on('error', (err) => {
          
      });
  });
}

async function getSiteSummary(id){
  const options = {
    hostname: 'api-ticketfront.interpark.com',
    path: '/v1/goods/'+id+'/summary?goodsCode='+id+'&priceGrade=&seatGrade=',
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
async function scheduleInfo(url){
  const res = await fetch(url)
    buff= await res.arrayBuffer();
    const decoder = new TextDecoder('euc-kr'); //utf-8로도 바꿔보고.., euc-kr로도 바꿔보고..
    const text = decoder.decode(buff);
    
    var $ = cheerio.load(text);
    var openInfo={}
    
    $goods =$('.btn')
    $goods.each(function(){
      str=$(this).html()
      i=str.indexOf('<a href="http:')
      str=str.substring(i+9)

      i=str.indexOf('"')
      str=str.substring(0,i)
      openInfo["url"]=str
      }
    )



    $infos =$('.info').children("ul").children("li")
    $infos.each(function(){
      str=$(this).text()
      i=str.indexOf('년')
      value=str.substr(i-4)
      type=str.substr(0,i-4)
      openInfo[type]=value
    })
    return openInfo
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
// test="https://ticket.interpark.com/webzine/paper/TPNoticeView.asp?bbsno=34&pageno=1&stext=%C0%CC%C1%D8%C8%A3&no=53614&groupno=53614&seq=0&KindOfGoods=TICKET&Genre=&sort=WriteDate"
// scheduleInfo(test)