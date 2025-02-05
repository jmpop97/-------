class FileList{
    constructor(){
        this.get()
    }
    async get(){
        const url = "http://127.0.0.1:8080/initList";
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
            console.log(fileName)
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
        });
        var siteUrl=data["url"]
        delete data["url"]
        document.getElementById("siteUrl").value=siteUrl
        SiteUrl.get()
        NotificationUrl.settingAlertData(data)
            // loadProductData()
    }
    static settingAlertData(data){
        const sel = document.getElementById("openTimeSelect");
        self.innerHTML=``
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
    }
    static get(){
        var id=SiteUrl.getProductId()
        SiteUrl.getProduct(id)
        SiteUrl.getDiscountData(id)
    }
    static clickButtun(){
        document.querySelector("#discount").value=document.getElementById("discountSelect").value
    }
    static setProduct(data){
        document.getElementById("title").value=data["goodsName"]
        document.getElementById("place").value=data["placeName"]
        document.getElementById("placeId").value=data["placeCode"]
        if (data["specialSeatingName"]=="단독판매"){
            document.getElementById("exclusive").checked=true
        }
        PlayDateTime.set(data["dates"])
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
class PlayDateTime{
    constructor(){
        document.getElementById("playDateTimeSelect").addEventListener("change",PlayDateTime.clickButtun);
    }
    static clickButtun(){
        document.querySelector("#playDateTime").value=document.getElementById("playDateTimeSelect").value
    }
    static set(data){
        const sel = document.getElementById("playDateTimeSelect");
        self.innerHTML=``
        for (var key in data){
            const opt = document.createElement("option");
            var text=PlayDateTime.formatDateTime(data[key])
            opt.value = text;
            opt.text = text;
            sel.add(opt, null);
        }
    }
    static formatDateTime(dateString) {
        const year = dateString.slice(0, 4);
        const month = dateString.slice(4, 6);
        const day = dateString.slice(6, 8);
        const hour = dateString.slice(8, 10);
        const minute = dateString.slice(10, 12);
    
        // 요일 계산
        const date = new Date(`${year}-${month}-${day}`);
        const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
        const weekDay = weekDays[date.getDay()];
    
        return `${year}.${month}.${day} (${weekDay}) ${hour}시 ${minute}분`;
    }
}
class RowColGroupList{
    
}
file=new FileList()
noti=new NotificationUrl()
openT=new OpenTime()
siteUrl=new SiteUrl()
playd= new PlayDateTime()