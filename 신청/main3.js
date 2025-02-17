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
        console.log(initlist)
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
        console.log(initlist)

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
class UserInfo{
    constructor(){
        document.getElementById("setUser").addEventListener("click",this.get);
        document.getElementById("userN").addEventListener("change",UserInfo.put);
    }
    get(){
        const users=JSON.parse(document.getElementById("userInfo").value)
        
        const sel =document.getElementById("userN")
        sel.innerHTML=``
        for (var key in users){
            const opt = document.createElement("option");
            var user =users[key]

            var text=user["playDateTime"]+" | "+user["siteLoginInfo"]
            opt.value = JSON.stringify(user);
            opt.text = text;
            sel.add(opt, null);
        }
        UserInfo.put()
    }
    static put(){
        var user=JSON.parse(document.getElementById("userN").value)
        document.getElementById("title").value=user["userTicketOpenName"]
        document.getElementById("playDateTime").value=user["playDateTime"]
        document.getElementById("siteLoginInfo").value=user["siteLoginInfo"]
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
            // const opt = document.createElement("option");
            // value ="수정중입니다."
            // text=수정중입니다+" | "+value
            // opt.value = value;
            // opt.text = text;
            // sel.add(opt, null);
    }
}
class OpenTime{
    constructor(){
        document.getElementById("openTimeSelect").addEventListener("change",this.set);
    }
    set(){
        document.getElementById("eventPeriod").value=document.getElementById("openTimeSelect").value
    }
}
class SiteUrl{
    constructor(){
        document.getElementById("loadProductData").addEventListener("click",SiteUrl.get);
        document.getElementById("discountSelect").addEventListener("change",SiteUrl.clickButtun)
        document.getElementById("firstUrl").addEventListener("click",SiteUrl.copyUrl)
    }
    static get(){
        var id=SiteUrl.getProductId()
        SiteUrl.getProduct(id)
        SiteUrl.getDiscountData(id)
    }
    static clickButtun(){
        document.querySelector("#discount").value=document.getElementById("discountSelect").value
    }
    static copyUrl(){
        var GoodsCode=SiteUrl.getProductId()
        var placeCode=document.getElementById("placeId").value
        var block=document.getElementById("selfDefineBlock").value
        var url=`https://poticket.interpark.com/Ticket/Seat/BookingSeatDetail.asp?GoodsCode=${GoodsCode}&PlaceCode=${placeCode}&TmgsOrNot=D2003&LocOfImage=&Tiki=&BizCode=Webbr&PlaySeq=001&SessionId=&Block=${block}`
        window.open(url)
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

class RowColGroupList{
    constructor(){
        document.getElementById("addRow").addEventListener("click",RowColGroupList.clickButtun);
    }
    static clickButtun(){
        var rowList=document.querySelector("#rowColGroupList")
        var i=(rowList.children.length)
        const div = document.createElement("div");
        div.className="seatField"
        div.ariaValueText=i

        const labelrow = document.createElement("label");
        labelrow.innerText="rowNum"
        const inputrow = document.createElement("input");
        inputrow.type="number"
        inputrow.id="rowNum-"+i
        inputrow.value=1
        const labelcal0 = document.createElement("label");
        labelcal0.innerText="colNumStart"
        const inputcal0 = document.createElement("input");
        inputcal0.type="number"
        inputcal0.id="rowNum-"+i+"-"+0
        const labelcal1 = document.createElement("label");
        labelcal1.innerText="colNumEnd"
        const inputcal1 = document.createElement("input");
        inputcal1.type="number"
        inputcal1.id="rowNum-"+i+"-"+1

        div.appendChild(labelrow)
        div.appendChild(inputrow)        
        div.appendChild(labelcal0)
        div.appendChild(inputcal0)
        div.appendChild(labelcal1)
        div.appendChild(inputcal1)
        rowList.appendChild(div)
    }
    static getRowColGroupList(){
        var rowList=document.querySelector("#rowColGroupList").children
        var rowColList=[]
        for (var i=0;i<rowList.length;i++){
            var detailList=rowList[i]
            var rowNum=Number(detailList.children[1].value)
            var colNumInit=Number(detailList.children[3].value)
            var colNumEnd=Number(detailList.children[5].value)
            if (colNumInit<=colNumEnd){
                for (var colNum=colNumInit;colNum<=colNumEnd;colNum++){
                    rowColList.push({rowNum,colNum})
                }
            }else{
                for (var colNum=colNumInit;colNum>=colNumEnd;colNum--){
                    rowColList.push({rowNum,colNum})
                }
            }
        }
        return [{rowColList}]
    }
}
class Result{
    constructor(){
        document.getElementById("getResultForm").addEventListener("click",Result.getResult);
        document.getElementById("postResult").addEventListener("click",Result.postResult);
    }
    static getResult(){
        console.log("work")
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
            "rowColGroupList": [
                {
                    "rowColList":[
                    {"rowNum": 1, "colNum": 7 },
                    {"rowNum": 1, "colNum": 8 },
                    {"rowNum": 1, "colNum": 9 },
                    {"rowNum": 1, "colNum": 10 },
                    {"rowNum": 1, "colNum": 11 },
                    {"rowNum": 1, "colNum": 12 },
                    {"rowNum": 1, "colNum": 13 },
                    {"rowNum": 1, "colNum": 14 },
                    {"rowNum": 1, "colNum": 15 },
                    {"rowNum": 1, "colNum": 16 },
                    {"rowNum": 1, "colNum": 17 },
                    {"rowNum": 1, "colNum": 18 },
                    {"rowNum": 1, "colNum": 19 },
                    {"rowNum": 1, "colNum": 20 },
                    {"rowNum": 1, "colNum": 21 },
                    {"rowNum": 1, "colNum": 22 }
                ]}
            ],
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
        form.rowColGroupList=RowColGroupList.getRowColGroupList()
        form.playDateTime=document.querySelector("#playDateTime").value
        form.siteLoginInfo=document.querySelector("#siteLoginInfo").value
        document.querySelector("#Result").value=JSON.stringify(form, null, 2)
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
        window.alert(data)
        return data
    }

}
class Button{
    constructor(){
        document.getElementById("saveJson").addEventListener("click",this.saveData);
    }
    async saveData(){
        console.log("saveData")
        let datas={}
        datas.userInfo=document.querySelector("#userInfo").value
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

        let url="http://127.0.0.1:8080/savePostDatas"
        var data= await fetch(url, {
            method: "POST",
            body: JSON.stringify(datas),
        }).then(response => {
            return response.text();
        }).catch(error => {
            window.alert(["fail"]);
        });
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