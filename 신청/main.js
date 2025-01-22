value_ids=["exclusive","openNotice","openDate","eventPeriod","snsUrl","siteUrl","place","discount","seatGradeStart","seatGradeEnd","seatGradeEnd","title","users"]        
bool_ids=["exclusive","openNotice"]
{
    function updateSeatGradePreview() {
        const start = document.getElementById("seatGradeStart").value;
        const end = document.getElementById("seatGradeEnd").value;
        document.getElementById("previewSeatGrade").textContent = `${start} ~ ${end}`;
    }
    function setCheckbox(id){
        const checkbox = document.getElementById(id);
        // Enter 키를 눌렀을 때 체크 상태 전환
        
        checkbox.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // 기본 Enter 동작 방지
                checkbox.checked = !checkbox.checked;
                checkbox.value = checkbox.checked ? "Y" : "N";
                if (checkbox.id=="exclusive"){
                    document.getElementById("previewExclusive").textContent = checkbox.value
                }
                if (checkbox.id=="openNotice"){
                    document.getElementById("previewOpenNotice").textContent = checkbox.value
                }
            }
        });
        // 체크 상태가 변경될 때 값 설정
        checkbox.addEventListener("change", function() {
            checkbox.value = checkbox.checked ? "Y" : "N";
        });
    }
    function copyNewUrl() {
        setInits();
        ms1=massage1(inits["title"])
        navigator.clipboard.writeText(ms1)
    }
    function copyTile(){
        tiles=[]
        tileInit=document.getElementById("seatGradeStart").value
        tileInit=tileInit.slice(0,-1)
        jsonTileInit=JSON.parse(tileInit)
        
        tileEnd=document.getElementById("seatGradeEnd").value
        tileEnd=tileEnd.slice(0,-1)
        jsonTileEnd=JSON.parse(tileEnd)
        
        init = Math.min(jsonTileInit["seatNo"],jsonTileEnd["seatNo"])
        console.log(init)
        end = Math.max(jsonTileInit["seatNo"],jsonTileEnd["seatNo"])

        for (i=init;i<=end;i++){
            jsonTileInit["seatNo"]=i.toString()
            tile=JSON.stringify(jsonTileInit)
            console.log(tile)
            
            tile=("                      ") + tile+","
            console.log(tile)
            tiles.push(tile)
        }

        tiles=tiles.join("\n")
        console.log(tiles)
        navigator.clipboard.writeText(tiles)
    }
    
    function copyUser(){
        user=document.getElementById("users").value
        users=JSON.parse(user)
        copyString=""
        for (i in users){
            user=users[i]
            for (key in user){
                if (key=="playDateTime" ){
                    copyString+='      "#'+key+'" : "'+user[key]+'",\n'
                }
                if (key=="siteLoginInfo"){
                    copyString+='      "#'+key+'" : "'+user[key]+'",\n\n'
                }

            }
        }
        // copyString=copyString.slice(0,-2)
        navigator.clipboard.writeText(copyString)
    }
    //~~~~~~~~~~~~~~~~~~~
    function setValue(id){
        document.getElementById(id).value=inits[id]
        
    }
    function setBool(id){
        document.getElementById(id).checked=inits[id]
    }
    function setValues(){
       
        for (i in value_ids){
            setValue(value_ids[i])
        }
        for (i in bool_ids){
            setBool(bool_ids[i])
        }
    }
    function putInits(data){
        inits=data
    }
    function setInits(){
        inits={
            "exclusive":document.getElementById("exclusive").checked,
            "openNotice" : document.getElementById("openNotice").checked,
            "openDate" : document.getElementById("openDate").value,
            "eventPeriod" : document.getElementById("eventPeriod").value,
            "snsUrl" : document.getElementById("snsUrl").value,
            "siteUrl" : document.getElementById("siteUrl").value,
            "place" : document.getElementById("place").value,
            "discount" : document.getElementById("discount").value,
            "seatGradeStart" : document.getElementById("seatGradeStart").value,
            "seatGradeEnd" : document.getElementById("seatGradeEnd").value,
            "title" :document.getElementById("title").value,
            "users" :document.getElementById("users").value,
        }
    }
    function setInitList(initlist){
        selector=document.getElementById("prefixSelector")
        selector.innerHTML=''
        const sel = document.createElement("select");
        sel.id="selectFile"
        for (i in initlist){
            fileName=initlist[i]
            
            const opt = document.createElement("option");    
            text=fileName.slice(0, -5)
            opt.value = fileName;
            opt.text = text;
            sel.add(opt, null);
        }
        selector.appendChild(sel)
        sel.addEventListener("change", function() {
            getInit(document.getElementById("selectFile").value)
        });
    }
    function settingUsers(){
        user=inits["users"]
        users=JSON.parse(user)
        for (i in users){
            console.log(users[i])
        }
    }

    function settingInit(){
        setInits()
        saveInit(inits)
        getInitList()
    }
    function openLink(){
        firsturl=seatImgUrl()
        window.open(firsturl,'_blank')
    }
    function loadAlertData(){
        settingAlertUrl()
        getAlertData(alertUrl)
    }
    function loadProductData(){
        settingProductId()
        getProductData(productId)
        getDiscountData(productId)
    }
    function settingProductId(){
        siteUrl=document.getElementById("siteUrl").value
        detail=siteUrl.split("/")
        productId =detail[detail.length-1]
        last=productId[(productId.length - 1)]
        if (last =="?"){
            productId=productId.slice(0,-1)
        }
    }
    function settingAlertUrl(){
        alertUrl=document.getElementById("notificationUrl").value
    }
    function putProductId(datas){
        if (datas["specialSeatingName"]=="단독판매"){
            document.getElementById("exclusive").checked=true
        }
        document.getElementById("title").value = datas["goodsName"]
        document.getElementById("place").value = datas["placeName"] + ', '+datas["placeCode"]

    }
    function settingDiscount(data){
        const sel = document.getElementById("discountSelect");
        for (i in data){
            const opt = document.createElement("option");
            infos =data[i]
            text=infos[0]+" | "+infos[2]+"원 | "+infos[1]
            opt.value = text;
            opt.text = text;
            sel.add(opt, null);
        }
    }

    function settingAlertData(data){
        const sel = document.getElementById("openTimeSelect");
        sel.addEventListener("change",function(){
            value=document.getElementById("openTimeSelect").value
            document.getElementById("eventPeriod").value=value
        })
        for (key in data){
            const opt = document.createElement("option");
            value =data[key]
            text=key+" | "+value
            opt.value = value;
            opt.text = text;
            sel.add(opt, null);
        }
    }
    function settingSiteUrl(siteUrl){
        document.getElementById("siteUrl").value=siteUrl
    }
}
//input
{
    document.getElementById("saveJson").addEventListener("click",settingInit);
    document.getElementById("loadAlertData").addEventListener("click",loadAlertData);
    document.getElementById("loadProductData").addEventListener("click",loadProductData);
    document.getElementById("firstUrl").addEventListener("click", openLink)
    document.getElementById("Message").addEventListener("click", copyNewUrl);
    document.getElementById("tiles").addEventListener("click", copyTile);
    document.getElementById("copyUserDatas").addEventListener("click", copyUser);
    document.getElementById("reset").addEventListener("click",settingInit);
    document.getElementById("goMoney").addEventListener("click",settingInit);
}


// 엔터키 checkbox
checkids=["exclusive","openNotice"]
{
    for (i in checkids){
        setCheckbox(checkids[i])
    }
    // 초기 로딩 시 링크 설정
}

//init
function setting(){
    getInitList()
    
    setValues();
}
setting()