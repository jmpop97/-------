function time(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class FileList{
    constructor(){
        this.get()
        document.getElementById("selectFile").addEventListener("change",this.getInit)
    }
    async get(){
        const url = "http://127.0.0.1:8080/loadPostDatasList";
        var data= await fetch(url, {
            method: "GET"
        }).then(response => {
            return response.text();
        }).then(text => {
            const data = JSON.parse(text);
            this.set(data)
            return data
        }).catch(error => {
            window.alert(["fail"]);
        });
        return data
    }
    set(initlist){
        var selector=document.getElementById("selectFile")
        selector.innerHTML=''
        for (var i in initlist){
            var fileName=initlist[i]
            const opt = document.createElement("option");    
            var text=fileName.slice(0, -5)
            opt.value = fileName;
            opt.text = text;
            selector.add(opt, null);
        }
        // sel.addEventListener("change", function() {
        //     getInit(document.getElementById("selectFile").value)
        // });

    }
    async getInit(){
        var fileName=document.getElementById("selectFile").value
        const url = "http://127.0.0.1:8080/loadPostDatas";
        var data= await fetch(url, {
            method: "POST",
            body: JSON.stringify({fileName}),
        }).then(response => {
            return response.text();
        }).then(text => {
            const data = JSON.parse(text);
            return data
        }).catch(error => {
            window.alert(["fail"]);
            window.open(alertUrl)
        });
        FileList.setInit(data)
    }
    static setInit(datas){
        document.querySelector("#userInfo").value=datas.userInfo
        document.querySelector("#title").value=datas.title
        document.querySelector("#playDateTime").value=datas.playDateTime
        document.querySelector("#siteLoginInfo").value=datas.siteLoginInfo
        document.querySelector("#notificationUrl").value=datas.notificationUrl
        document.querySelector("#eventPeriod").value=datas.eventPeriod
        document.querySelector("#siteUrl").value=datas.siteUrl
        document.querySelector("#place").value=datas.place
        document.querySelector("#placeId").value=datas.placeId
        document.querySelector("#selfDefineBlock").value=datas.selfDefineBlock
        document.querySelector("#exclusive").checked=datas.exclusive
        document.querySelector("#snsUrl").value=datas.snsUrl
        document.querySelector("#rowNum-0").value=datas.rowNum_0
        document.querySelector("#colNum-0-0").value=datas.colNum_0_0
        document.querySelector("#colNum-0-1").value=datas.colNum_0_1
        document.querySelector("#Result").value=datas.Result
    }
}
users=[]
phoneCount={}
class UserInfo{
    constructor(){
        document.getElementById("setUser").addEventListener("click",this.get);
        document.getElementById("addOneUser").addEventListener("click",UserInfo.addUserInfo);
    }
    get(){
        users=JSON.parse(document.getElementById("userInfo").value)
        UserInfo.getPhoneCount()
        UserInfo.sortUser()
        UserInfo.getCheckbox()
    }
    static getPhoneCount(){
        //횟수 카운팅
        for (var i in users){
            console.log(users[i])
            var phone=users[i]["siteLoginInfo"]
            if (phoneCount[phone]){
                phoneCount[phone].count+=1
                phoneCount[phone]["user"].push(users[i])
            }else{
                phoneCount[phone]={}
                phoneCount[phone].count=1
                phoneCount[phone]["user"]=[users[i]]
            }
            users[i]["time"]=0
            users[i]["checked"]=true
        }
        //4개 잘 나눠기
        for (var phoneCountI in phoneCount){
            var phone =phoneCount[phoneCountI]
            for (var count=0;count<4;count++){
                // console.log(phone.user[0])
                // console.log(phone.count)
                var addUser =phone.user[count%phone.count]
                addUser.time+=1

            }
        }
    }
    static sortUser(){
        users=users.sort((a, b) => a.userHp.localeCompare(b.userHp));
    }
    static async getCheckbox(){
        const sel = document.getElementById("userCheck");
        const addUserInfoSel = document.getElementById("addOneUser");
        // sel.addEventListener("click",UserInfo.put);
        sel.innerHTML = ""; // 기존 내용 초기화
        
        for (var key in users) {
            const setting=(key,users)=>{
                const label = document.createElement("label");
                const opt = document.createElement("input");
                opt.type = "checkbox"; // radio → checkbox 변경
                opt.name = "userSelect";
                opt.value = key
                opt.checked = users[key]["checked"]
                opt.addEventListener("change",()=>UserInfo.put())
                opt.addEventListener("change",()=>users[key]["checked"]=opt.checked)
    
                const inputInfoDate = document.createElement("input")            
                inputInfoDate.value =users[key]["playDateTime"]
                inputInfoDate.id="loginInfoDate_"+key
                inputInfoDate.className = "loginInfoDate"
                inputInfoDate.addEventListener("change",()=>UserInfo.changeDate(inputInfoDate,key))
    
                const inputInfo = document.createElement("input")            
                inputInfo.value =users[key]["siteLoginInfo"]
                inputInfo.id="loginInfo_"+key
                inputInfo.className = "loginInfoInput"
                inputInfo.addEventListener("change",()=>UserInfo.changeloginInfo(inputInfo,key))
    
    
                const inputInfoTimes = document.createElement("input")
                inputInfoTimes.type="number"
                inputInfoTimes.value=users[key]["time"]
                inputInfo.id="loginInfoNumber_"+key
                inputInfoTimes.addEventListener("change",()=>UserInfo.changeTimes(inputInfoTimes,key))

    
    
                label.appendChild(opt);
                label.appendChild(inputInfoDate);
                label.appendChild(inputInfo);
                label.appendChild(inputInfoTimes);
                
                
                sel.appendChild(label);
            }
            await setting(key,users)
            sel.appendChild(addUserInfoSel)


            // sel.appendChild(document.createElement("br")); // 줄 바꿈 추가
        }
        UserInfo.put()
    }
    static changeDate(el,key){
        users[key]["playDateTime"]=el.value
        UserInfo.put()
    }
    static changeloginInfo(el,key){
        users[key]["siteLoginInfo"]=el.value
        UserInfo.put()
    }
    static changeTimes(el,key){
        users[key]["time"]=el.value
        UserInfo.put()
    }
    static put(){
        var user=users[UserInfo.userCheckBox()[0]]
        document.getElementById("title").value=user["userTicketOpenName"]
        document.getElementById("playDateTime").value=user["playDateTime"]
        document.getElementById("siteLoginInfo").value=user["siteLoginInfo"]
    }
    
    static userRadio(){
        const selectedGender = document.querySelector('input[name="gender"]:checked')?.value;
        console.log(selectedGender);
    }
    static userCheckBox(){
        const selectedValues = Array.from(document.querySelectorAll('input[name="userSelect"]:checked'))
        .map(checkbox => checkbox.value); // 체크된 항목들의 value 값 배열 생성
    return selectedValues;
    }
    static addUserInfo(){
        var user={
            "id":"1",
            "userHp": "0",
            "userTicketOpenName": "",
            "#1-": null,
            "playDateTime": "",
            "siteLoginInfo": "",
            "#2-": null,
            "time": 4,
            "checked":true
        }
        users.push(user)
        console.log(users)
        var phone=user["userHp"]
        if (phoneCount[phone]){
            phoneCount[phone].count+=1
            phoneCount[phone]["user"].push(user)
        }else{
            phoneCount[phone]={}
            phoneCount[phone].count=1
            phoneCount[phone]["user"]=[user]
        }
        UserInfo.getCheckbox()
    }
}
class NotificationUrl{
    constructor(){
        document.getElementById("loadAlertData").addEventListener("click",this.get);
        document.getElementById("openTimeSelect").addEventListener("change",this.selectOpenTime)
    }
    selectOpenTime(){
        document.getElementById("eventPeriod").value=document.getElementById("openTimeSelect").value
    }
    async get(){
        var alertUrl=document.getElementById("notificationUrl").value
        const url = "http://127.0.0.1:8080/alertData";
        var data= await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                url: alertUrl,
              }),
        }).then(response => {
            return response.text();
        }).then(text => {
            const data = JSON.parse(text);
            return data
        }).catch(error => {
            window.alert(["fail"]);
            window.open(alertUrl)
        });
        console.log(data)
        var siteUrl=data["url"]
        delete data["url"]
        document.getElementById("siteUrl").value=siteUrl
        SiteUrl.get()
        NotificationUrl.settingAlertData(data)
        OpenTime.set()
        console.log("working")
            // loadProductData()
    }
    static settingAlertData(data){
        const sel = document.getElementById("openTimeSelect");
        sel.innerHTML=``
        for (var key in data){
            const opt = document.createElement("option");
            var value =data[key]
            var text=key+" | "+value
            opt.value = value;
            opt.text = text;
            sel.add(opt, null);
        }
    }
}
class OpenTime{
    constructor(){
        document.getElementById("openTimeSelect").addEventListener("change",OpenTime.set);
    }
    static set(){
        document.getElementById("eventPeriod").value=document.getElementById("openTimeSelect").value
    }
}
class SiteUrl{
    constructor(){
        document.getElementById("loadProductData").addEventListener("click",SiteUrl.get);
        document.getElementById("discountSelect").addEventListener("change",SiteUrl.clickButtun)
        document.getElementById("firstUrl").addEventListener("click",SiteUrl.getImg)
        document.getElementById("selfDefineBlock").addEventListener("change",SiteUrl.getImg)
    }
    static async get(){
        var id=SiteUrl.getProductId()
        await SiteUrl.getProduct(id)
        await SiteUrl.getDiscountData(id)
        SiteUrl.getImg()
    }
    static clickButtun(){
        document.querySelector("#discount").value=document.getElementById("discountSelect").value
    }
    static getImg(){
        console.log("work")
        var GoodsCode=SiteUrl.getProductId()
        var placeCode=document.getElementById("placeId").value
        var block=document.getElementById("selfDefineBlock").value
        var url=`https://poticket.interpark.com/Ticket/Seat/BookingSeatDetail.asp?GoodsCode=${GoodsCode}&PlaceCode=${placeCode}&TmgsOrNot=D2003&LocOfImage=&Tiki=&BizCode=Webbr&PlaySeq=001&SessionId=&Block=${block}`
        
        var img=document.getElementById("imgPath")
        img.src=url
        img.width="100%"
        img.height="300"
    }

    static setProduct(data){
        document.getElementById("place").value=data["placeName"]
        document.getElementById("placeId").value=data["placeCode"]
        if (data["specialSeatingName"]=="단독판매"){
            document.getElementById("exclusive").checked=true
        }
    }
    static setDiscount(data){
        const sel = document.getElementById("discountSelect");
        for (var i in data){
            const opt = document.createElement("option");
            var infos =data[i]
            var text=infos[0]+" | "+infos[2]+"원 | "+infos[1]
            opt.value = infos[1];
            opt.text = text;
            sel.add(opt, null);
        }
    }
    static async getProduct(id){
        const url = "http://127.0.0.1:8080/productData";
        var data= await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                id: id,
              }),
        }).then(response => {
            return response.text();
        }).then(text => {
            const data = JSON.parse(text);
            return data
        }).catch(error => {
            window.alert(["fail"]);
        });
        SiteUrl.setProduct(data)
    }
    static async getDiscountData(id){
        const url = "http://127.0.0.1:8080/discountData";
        var data= await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                id: id,
              }),
        }).then(response => {
            return response.text();
        }).then(text => {
            const data = JSON.parse(text);
            return data
        }).catch(error => {
            window.alert(["fail"]);
        });
        console.log(data)
        SiteUrl.setDiscount(data)
    }
    static getProductId(){
        var siteUrl=document.getElementById("siteUrl").value
        var detail=siteUrl.split("/")
        var productId =detail[detail.length-1]
        var last=productId[(productId.length - 1)]
        if (last =="?"){
            productId=productId.slice(0,-1)
        }
        return productId
    }
}

class TicketingMode{
    constructor(){
        document.querySelector("#ticketingModeSelect").addEventListener("change",TicketingMode.createForm)
        TicketingMode.createForm()
    }
    static createForm(){
        var select = document.querySelector("#ticketingModeSelect").value
        var selectForm={
            NORMAL:RowColGroupList,
            BMBI:SeatInfoGroupListForBMBI
        }
       var form=selectForm[select]
       form.createForm()
    }
    static values(){
        var select = document.querySelector("#ticketingModeSelect").value
        var selectForm={
            NORMAL:RowColGroupList,
            BMBI:SeatInfoGroupListForBMBI
        }
       var value=selectForm[select].value()
       return value
    }
}
BMBIRangeList=[]
class SeatInfoGroupListForBMBI{
    static createForm(){
        var el = document.getElementById("modeForm");
        el.innerHTML = `
            <label for="SeatInfoGroupListForBMBI">SeatInfoGroupListForBMBI:</label>
            <input type="text" id="SeatInfoForm" value ='{"seatGrade":"1","floor":" ","rowNo":"A열","seatNo":"10","blockNo":"001"}'></input>
            <div id="SeatInfoFormList"></div>
            <button type="button" id="SeatInfoGroupListForBMBIButton">추가하기</button>
        `
        var SeatInfoGroupListForBMBIButton= document.querySelector("#SeatInfoGroupListForBMBIButton")
        SeatInfoGroupListForBMBIButton.addEventListener("click",SeatInfoGroupListForBMBI.add)
    }
    static add(){
        var jsonData=JSON.parse(document.querySelector("#SeatInfoForm").value)
        var jsonData=JSON.parse(document.querySelector("#SeatInfoForm").value)
        jsonData=Object.fromEntries(
            Object.entries(jsonData).map(([key, value]) => {
                // value가 문자열이며, 숫자로 변환 가능하고, 0으로 시작하지 않으면 변환
                if (typeof value === "string" && /^\d+$/.test(value) && !value.startsWith("0")) {
                    return [key, [Number(value), Number(value)]];
                }
                return [key, value];
            })
        );
        jsonData={check:true,...jsonData}
        console.log(jsonData)
        BMBIRangeList.push(jsonData)
        SeatInfoGroupListForBMBI.setBMBIRangeList()
    }
    static setBMBIRangeList(){
        var seatList=document.querySelector("#SeatInfoFormList")
        seatList.innerHTML=''
        for(var BMBIRangeListI in BMBIRangeList){
            const label = document.createElement("label");
            label.className="BMBIRange"

            const setting=(BMBIRangeListI,BMBIRangeList)=>{
                var BMBIRange=BMBIRangeList[BMBIRangeListI]
                for (var key in BMBIRange){
                    SeatInfoGroupListForBMBI.createFormEl(key,BMBIRange[key],label,BMBIRangeListI)
                }
                seatList.appendChild(label)
            }
            setting(BMBIRangeListI,BMBIRangeList)
        }
    }
    static createFormEl(key,value,div,i){
        if (key=="check"){
            const check =document.createElement("input")
            check.type="checkbox"
            check.checked = value
            check.addEventListener("click",()=>{
                BMBIRangeList[i].check=check.checked
            })
            div.appendChild(check)
            return
        }

        var type="string"
        if (Array.isArray(value)){
            type="number"
        }
        const label = document.createElement("label");
        label.innerText=key
        const inputInit = document.createElement("input");
        div.appendChild(label)
        inputInit.type=type
        if (type!="number"){
            inputInit.value=value

            inputInit.className="SeatInfoGroupListForBMBIStringInput"
            inputInit.addEventListener("change",()=>{
                BMBIRangeList[i][key]=inputInit.value
            })
            div.appendChild(inputInit)
            return
        }
        inputInit.value=value[0]
        inputInit.addEventListener("change",()=>{
            BMBIRangeList[i][key][0]=Number(inputInit.value)
        })
        div.appendChild(inputInit)

        const inputEnd = document.createElement("input");
        inputEnd.value=value[1]
        inputEnd.type=type
        inputEnd.addEventListener("change",()=>{
            BMBIRangeList[i][key][1]=Number(inputEnd.value)
        })
        div.appendChild(inputEnd)   
    }
    static value(){
        var seatInfoInternalList=[]
        for (var BMBIRangeListI in BMBIRangeList){
            var BMBIRange=BMBIRangeList[BMBIRangeListI]
            if (BMBIRange.check){
                var result=expandRanges(BMBIRange)
                var result=cartesianProduct(result)
                console.log(result)
                seatInfoInternalList=[...seatInfoInternalList,...result]

            }
        }
        return {seatInfoGroupListForBMBI:[{seatInfoInternalList}]}
    }
}
function cartesianProduct(obj) {
  const keys = Object.keys(obj);
  const values = Object.values(obj);
  return values.reduce((acc, curr) =>
    acc.flatMap(a => {
         return curr.map(b => {
            return ({ ...a, [keys[acc[0] ? Object.keys(a).length : 0]]: b })
        })
        })
  , [{}]);
}
function expandRanges(obj) {
    const expanded = {};
    for (const key in obj) { 
      if (Array.isArray(obj[key]) && obj[key].length === 2) {
        const [start, end] = obj[key];
        const valueList=[]
        if (start<=end){
            for(var count=start;count<=end;count++){
                valueList.push(String(count))
            }
        }else{
            for(var count=start;count>=end;count--){
                valueList.push(String(count))
            }
        }
        expanded[key] = valueList
      } else {
        expanded[key] = [obj[key]];
      }
    }
    return expanded;
  }
rowRangeList=[{check:true,row:1,col1:1,col2:1}]
class RowColGroupList{
    static createForm(){
        var el = document.getElementById("modeForm");
        el.innerHTML = `
            <div id="rowColGroupList">
            </div>
            <button id="addRow" type="button">좌석 추가</button>
        `;
        document.getElementById("addRow").addEventListener("click",RowColGroupList.add);
        RowColGroupList.setRowRangeList()
    }
    static setRowRangeList(){
        var rowList=document.querySelector("#rowColGroupList")
        rowList.innerHTML=''
        for(var rowRangeListI in rowRangeList){ 
            const setting=(rowRangeListI,rowRangeList)=>{
                var rowRange=rowRangeList[rowRangeListI]
            
                const label = document.createElement("label");
                label.className="RowColGroupList"
                const opt = document.createElement("input");
                opt.type = "checkbox";
                opt.name = "seatSelect";
                opt.checked = rowRange.check
                opt.addEventListener("click",()=>{
                    rowRangeList[rowRangeListI].check=opt.checked
                    console.log(rowRangeList)
                })
    
                const rowtext = document.createElement("div")
                rowtext.textContent="rowNum"
                const row = document.createElement("input")
                row.type = "number"
                row.value =rowRange.row
                row.addEventListener("change",()=>{
                    rowRangeList[rowRangeListI].row=Number(row.value)
                })
    
                const coltext = document.createElement("div")
                coltext.textContent="colNum"
                const col1 = document.createElement("input")
                col1.type = "number"
                col1.value =rowRange.col1
                col1.addEventListener("change",()=>{
                    rowRangeList[rowRangeListI].col1=Number(col1.value)
                })
                const to = document.createElement("div")
                to.textContent="to"      
                const col2 = document.createElement("input")
                col2.type = "number"
                col2.value =rowRange.col2
                col2.addEventListener("change",()=>{
                    rowRangeList[rowRangeListI].col2=Number(col2.value)
                })
    
                label.appendChild(opt)
                label.appendChild(rowtext)
                label.appendChild(row)
                label.appendChild(coltext)
                label.appendChild(col1)
                label.appendChild(to)
                label.appendChild(col2)
    
                rowList.appendChild(label)
            }
            setting(rowRangeListI,rowRangeList)
        }
    }
    static add(){
        var rowRange=rowRangeList[rowRangeList.length-1]
        var newrowRange={
            check:true,row:rowRange.row,col1:rowRange.col1,col2:rowRange.col2
        }
        rowRangeList.push(newrowRange)
        RowColGroupList.setRowRangeList()
    }
    static value(){
        var rowColList=[]
        for (var rowRangeListI in rowRangeList){
            var rowRange = rowRangeList[rowRangeListI]
            if (rowRange.check){
                console.log(rowRange)
                var start=rowRange.col1
                var end=rowRange.col2

                if (start<=end){
                    for(var count=start;count<=end;count++){
                        rowColList.push({rowNum:rowRange.row,colNum:count})
                    }
                }else{
                    for(var count=start;count>=end;count--){
                        rowColList.push({rowNum:rowRange.row,colNum:count})
                    }
                }
                
            }
        }
        return {rowColGroupList:[{rowColList}]}
    }

}
class Result{
    constructor(){
        document.getElementById("getResultForm").addEventListener("click",Result.getResult);
        document.getElementById("postResult").addEventListener("click",Result.postResult);
        document.getElementById("postMultyResult").addEventListener("click",Result.postMultyResult);
    }
    static getResult(){
        var form={
            "rcpId": "558",
            "rcpTitle": "THE PLAYER Season 1 데이브레이크 루시",
            "ticketOpenTime": "2025년 1월 24일(금) 오후 4시",
            "goodsCode": "L0000114",
            "priceGradeName": "일반",
            "placeCode": "L0000001",
            "tmgsOrNot": "D2003",
            "selfDefineBlock": "001",
            "ticketOpenSite": "INPK",
            "rowColYn": "Y",
            "playDateTime" : "2025.03.22 (토) 18시 00분",
            "siteLoginInfo" : "JinDeul tkjoqlz.00 01099385750",
            "bookEndCntLimit": "4", "playSeq": "001", "playSeqYn": "N",
            "enableYn": "Y", "waitingSeatTimeoutDuration": "30m", "onlyBookInfoYn": "N",
            "tkId": "--", "siteLoginId": "--", "siteLoginPwd": "--", "playDate": "--", "playTime": "--",
            "playDateTimeYn": "Y", "siteLoginInfoYn": "Y",
            "status": "ReadyForDispatch",
            "ticketingMode": "NORMAL"
        }
        form.rcpTitle=document.querySelector("#title").value
        form.ticketOpenTime=document.querySelector("#eventPeriod").value
        form.goodsCode=SiteUrl.getProductId()
        form.priceGradeName=document.querySelector("#discount").value
        form.placeCode=document.querySelector("#placeId").value
        form.trgOrNot="D2003"
        form.selfDefineBlock=document.querySelector("#selfDefineBlock").value
        form.ticketOpenSite="INPK"
        form.rowColYn="Y"
        form.playDateTime=document.querySelector("#playDateTime").value
        form.siteLoginInfo=document.querySelector("#siteLoginInfo").value
        form.ticketingMode=document.querySelector("#ticketingModeSelect").value
        
        form.Test=false
        try {
            form.Test=test    
        } catch (error) {
        }
        var seatForm=TicketingMode.values()
        Object.assign(form,seatForm)

        document.querySelector("#Result").value=JSON.stringify(form, null, 2)
    }
    static async postMultyResult(){
        alert("보내기 start")
        var postUserList=UserInfo.userCheckBox()
        for (var postUserListI in postUserList){
            console.log(users,postUserList)
            var user=users[postUserList[postUserListI]]
            console.log(user)
            for (var i=0; i<user["time"];i++){
                var user=users[postUserList[postUserListI]]
                document.getElementById("title").value=user["userTicketOpenName"]
                document.getElementById("playDateTime").value=user["playDateTime"]
                document.getElementById("siteLoginInfo").value=user["siteLoginInfo"]
                Result.getResult()
                Result.postResult()
                console.log(document.querySelector("#Result").value)
                await time(2000); // 10초 대기
            }
        }
        alert("보내기 end")
    }
    static async postResult(){
        var result=document.querySelector("#Result").value
        const url = "http://127.0.0.1:8080/postData";
        var data= await fetch(url, {
            method: "POST",
            body: result,
        }).then(response => {
            return response.text();
        }).catch(error => {
            window.alert(["fail"]);
        });
        if (data.includes(`"enableYn":"Y"`)){
        }else{
            console.error(data)
        }
        return data
    }

}
class Button{
    constructor(){
        document.getElementById("saveJson").addEventListener("click",this.saveData);
    }
    async saveData(){
        alter("startSave")
        console.log("saveData")
        let datas={}
        datas.userInfo=document.querySelector("#userInfo").value
        datas.users=users

        datas.title=document.querySelector("#title").value
        datas.playDateTime=document.querySelector("#playDateTime").value
        datas.siteLoginInfo=document.querySelector("#siteLoginInfo").value

        datas.notificationUrl=document.querySelector("#notificationUrl").value
        datas.eventPeriod=document.querySelector("#eventPeriod").value
        datas.siteUrl=document.querySelector("#siteUrl").value
        datas.place=document.querySelector("#place").value
        datas.placeId=document.querySelector("#placeId").value
        datas.selfDefineBlock=document.querySelector("#selfDefineBlock").value
        datas.exclusive=document.querySelector("#exclusive").checked
        datas.snsUrl=document.querySelector("#snsUrl").value
        datas.rowNum_0=document.querySelector("#rowNum-0").value
        datas.colNum_0_0=document.querySelector("#colNum-0-0").value
        datas.colNum_0_1=document.querySelector("#colNum-0-1").value
        datas.Result=document.querySelector("#Result").value
        datas.BMBIRangeList=BMBIRangeList
        datas.rowRangeList=rowRangeList
        datas.seatForm=TicketingMode.values()
        let url="http://127.0.0.1:8080/savePostDatas"
        var data= await fetch(url, {
            method: "POST",
            body: JSON.stringify(datas),
        }).then(response => {
            return response.text();
        }).catch(error => {
            window.alert(["fail"]);
        });
        alter("endSave")

    }
}
file=new FileList()
noti=new NotificationUrl()
openT=new OpenTime()
siteUrl=new SiteUrl()
rowCol= new RowColGroupList()
result = new Result()
userInfo = new UserInfo()
button = new Button()
ticketingMode = new TicketingMode()