let exec = require('child_process').exec
var http = require('http'); 
var https = require('https'); 
const fs = require('fs');
var cheerio = require('cheerio');
const util = require("util");

var initList
var server = http.createServer(function(request,res){ 
  try {
    url=request.url
    console.log(url)
    if (url =="/saveInit"){
      saveJson(request,res)
    }else if(url == "/initList"){
      initList(request,res)
    }else if(url == "/loadInit"){
      loadInit(request,res)
    }
    
    if(url == "/savePostDatas"){
      saveJsonPostInit(request,res)
    }else if(url == "/loadPostDatasList"){
      loadJsonPostInitList(request,res)
    }else if(url == "/loadPostDatas"){
      loadPostDatasInit(request,res)
    }
    
    if(url == "/productData"){
      productData(request,res)
    }else if(url == "/discountData"){
      discountData(request,res)
    }else if(url == "/alertData"){
      alertData(request,res)
    }else if(url == "/money/initList"){
      initMoneyList(request,res)
    }else if(url == "/money/loadInit"){
      loadMoneyInit(request,res)
    }else if(url == "/money/saveInit"){
      saveMoneyJson(request,res)
    }else if(url == "/postData"){
      postData(request,res)
    }
    
  } catch (error) {
    
  }

});

// 3. listen 함수로 8080 포트를 가진 서버를 실행한다. 서버가 실행된 것을 콘솔창에서 확인하기 위해 'Server is running...' 로그를 출력한다
server.listen(8080, function(){ 
  console.log('Server is running...');
});




//~~~~~~~~~~~~~~~~REST API function~~~~~~~~~~~~~
function saveInitData(body){
  body=JSON.parse(body)
  let json = JSON.stringify(body,null,2);
  let today = getDate()
  console.log(today)
  path="/initData/"+today+" "+body.title+".json"
  path=path.replaceAll(".","_")
  path=path.replaceAll(" ","_")
  path="."+path
  try {
      fs.writeFileSync(path, json);
    } catch (error) {
      console.log(error)
    }
  return path
}
function savePostInitData(body){
  body=JSON.parse(body)
  let json = JSON.stringify(body,null,2);
  let today = getDate()
  console.log(today)
  path="/신청/initData/"+today+" "+body.title
  path=path.replaceAll(". "," ")
  path=path.replaceAll(" ","_")
  path="."+path+".json"
  try {
      fs.writeFileSync(path, json);
    } catch (error) {
      console.log(error)
    }
  return path
}
function saveJson(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', function() {
    saveInitData(body)

    res.setHeader('Content-Type', 'application/json charset=utf-8')
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end("hi")
  })
}
function saveJsonPostInit(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', function() {
    savePostInitData(body)

    res.setHeader('Content-Type', 'application/json charset=utf-8')
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end("hi")
  })
}
function saveMoneyJson(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', function() {
    body=JSON.parse(body)
    console.log(body.goodName)
    let json = JSON.stringify(body,null,2);
    let today = getDate()
    today=today.replaceAll(".","_")
    today=today.replaceAll(" ","")
    path="./Data수금/"+today+body.goodName+".json"
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
function loadJsonPostInitList(request,res){
  dir="./신청/initData"
  filelists=fs.readdirSync(dir)
  res.setHeader('Content-Type', 'application/json charset=utf-8')
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(filelists.reverse()))
}
function initMoneyList(request,res){
  dir="./Data수금"
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
function loadPostDatasInit(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', function() {

    body=JSON.parse(body)
    const jsonFile = fs.readFileSync('./신청/initData/'+body.fileName, 'utf8');
    res.setHeader('Content-Type', 'application/json charset=utf-8')
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(jsonFile)
  })
}
function loadMoneyInit(request,res){
  var body = ''
  request.on('data', function(data) {
    body += data
  })
  request.on('end', function() {

    body=JSON.parse(body)
    const jsonFile = fs.readFileSync('./Data수금/'+body.fileName, 'utf8');
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
    result = {}
    body=JSON.parse(body)
    try {
      result = await scheduleInfo(body.url)
      console.log("result",result)
    }catch{
      result ={}
    }
    console.log(result)
    res.setHeader('Content-Type', 'application/json charset=utf-8')
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(result))
  })
}

//~~~~~~~~~~~~~~~~터미널~~~~~~~~~~~~~
function savepostData(body){
  
  let json = JSON.stringify(body,null,2);
  let today = getDate()
  console.log(today)
  path="/신청/postData/"+today+" "+body.rcpTitle+".json"
  path=path.replaceAll(". ","_")
  path=path.replaceAll(" ","_")
  path="."+path
  try {
      fs.writeFileSync(path, json);
    } catch (error) {
      console.log(error)
    }
  return path
}
function spawnTest() {
  exec('ls -al', (err,out,stderr) => { 
    console.log(out)
  });
}
function postData(request,res){
    var body = ''
    request.on('data', function(data) {
      body += data
    })
    request.on('end', async function() {
      body=JSON.parse(body)
      fileName = savepostData(body)
      result=await postTerminal(fileName,body.Test)
      res.setHeader('Content-Type', 'application/json charset=utf-8')
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(result)
    })

}
async function postTerminal(fileName,Test) {
  // terminal=`cat InitData/${fileName} | jq . | curl -X POST -k "https://wle.kr/tkInfos" -d @-`
  if (Test){
    terminal=`cat ${fileName}`
  }else{
    terminal=`cat ${fileName} | jq . | curl -X POST -k "https://wle.kr/tkInfos" -d @-`
  }
  const execPromise = util.promisify(exec);
  try {
    const { stdout, stderr } = await execPromise(terminal);
    console.log(stdout)
    return stdout
  } catch (error) {
  }
  return "실패"
}



//~~~~~~~~~~~~~~~~api~~~~~~~~~~~~~
function fetchJson(options) {
  try {
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
  } catch (error) {
    return {}
  }

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
  specialSeatingName=data["specialSeatingName"]
  const dates = await getSiteSummaryDate(id,data["playEndDate"],data["playStartDate"])
  console.log(dates)
  return {
    goodsName,
    placeName,
    placeCode,
    specialSeatingName,
    dates
  }
}
async function getSiteSummaryDate(id,endDate,startDate){
  const options = {
    hostname: 'api-ticketfront.interpark.com',
    path: '/v1/goods/'+id+'/playSeq?endDate='+endDate+'&goodsCode='+id+'&isBookableDate=true&page=1&pageSize=1550&startDate='+startDate,
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
  dates=[]
  for (dataI in data){
    dates.push(data[dataI].playDate+data[dataI].playTime)
  }
  return dates
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
  console.log("?? : ", url)
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
    console.log(str)
    i=str.indexOf('년')
    value=str.substr(i-4)
    value=value.slice(0,-1)
    type=str.substr(0,i-4)
    openInfo[type]=value
  })
  console.log(openInfo)
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
test="https://ticket.interpark.com/webzine/paper/TPNoticeView.asp?bbsno=34&pageno=1&stext=&no=54488&groupno=54488&seq=0&KindOfGoods=TICKET&Genre=&sort=WriteDate"
testId="L0000114"
// getSiteSummary(testId)