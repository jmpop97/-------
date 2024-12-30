function setInitList(data){
    const sel = document.getElementById("selectData")
    sel.innerHTML=''
    for (i in data){
        const opt = document.createElement("option")
        opt.value = data[i];
        opt.text = data[i].slice(0,-5);
        sel.add(opt, null);
    }
}
function selectInit(){
    getInit(document.getElementById("selectData").value)
}
function putInits(data){
    datas=data
    putAll()
}
function putAll(){
    document.getElementById("goodsName").value = datas["goodsName"]
    document.getElementById("inputUser").value = datas["user"]
    document.getElementById("inputSeat").value = datas["seat"]
    
    putUserData()
    putSeatData()
    
}
function putUserData(){
    userList=Object.keys(datas["userSeat"]).sort()
    const sel = document.getElementById("selectUser")
    sel.innerHTML=''
    for (i in userList){
        const opt = document.createElement("option")
        opt.value = i;
        opt.text = userList[i];
        sel.add(opt, null);
        if (i== datas.userI){
            opt.selected=true
        }
    }
}
function putSeatData(){
    userList=Object.keys(datas["userSeat"]).sort()
    user=userList[datas.userI]
    seatList=datas.userSeat[user]
    console.log(seatList,user)
    const sel = document.getElementById("leftSeatList")
    sel.innerHTML=''
    seatData=datas["seatData"]
    for (i in seatList){
        const opt = document.createElement("input")
        // opt.setAttribute("type", "text");
        opt.type="checkbox"
        opt.id = seatList[i];
        opt.value = seatList[i];
        opt.addEventListener("click",()=>{seatClick(opt)})
        text=seatList[i]
        opt.checked=seatData[text]["select"]
        text=seatData[text]["seat"]+"  |  "+seatData[text]["day"]+"  |  "+seatData[text]["character"]
        sel.append(opt,text)
        const br = document.createElement("br")
        sel.append(br)
    }
    console.log(seatList)
}
async function seatClick(event){
    datas.seatData[event.value].select=event.checked
    UIDatas()
}
function getInputUserData(){
    
    userData={}
    datas["userSeat"]=userData
    users = datas["user"].split("\n")
    for (user in users){
        name=users[user]
        if (name ==""){
            continue
        }
        userData[name]=[]
    }

    seatData={}
    datas["seatData"]=seatData

    seats= datas["seat"].split("\n")
    for (i in seats){
        seatdata=seats[i].split("|")
        day=seatdata[0]+"|"+seatdata[1]
        seat=seatdata[2]
        character=seatdata[3]
        
        userinfos=seatdata[4].split(" ")
        id_pwd=userinfos[1]+" "+userinfos[2]
        tkId=userinfos[3]
        ph=userinfos[4]

        seatData[tkId]={
            "day":day,
            "seat":seat,
            "character":character,
            "id_pwd":id_pwd,
            "ph":ph,
            "select": false
        }
        try {
            datas["userSeat"][ph].push(tkId)
        } catch (error) {
            datas["userSeat"][ph]=[tkId]
        }
    }

    users=Object.keys(datas["userSeat"]).sort()
    putUserData(users)
}
function getInputSeatData(){
    userSelet()

    putSeatData()
}
function getInputDatas(){
    const inputUser = document.getElementById("inputUser").value
    datas["user"]=inputUser
    const inputSeat = document.getElementById("inputSeat").value
    datas["seat"]=inputSeat
}
function loadInputData(){
    getInputDatas()
    getInputUserData()
    datas.userI=0
    settingbutton()
    saveInit()
}
function settingbutton(){
    putUserData()
    putSeatData()
    UIDatas()
}
function userSelet(){
    datas["userI"]= document.getElementById("selectUser").value
    settingbutton()

}
function userNext(){
    users=Object.values(datas["userSeat"])
    userI=datas["userI"]
    if (userI<users.length-1){
        datas["userI"]++
    }

    settingbutton()

}
function userBefore(){
    users=Object.values(datas["userSeat"])
    userI=datas["userI"]
    if (userI>0){
        datas["userI"]--
    }

    settingbutton()

}
function selectSave(){
    saveInit()
    UIDatas()
}
function UIDatas(){
    UILeftSeat()
    UIUserSeat()
}
function UILeftSeat(){
    leftSeat={}
    for (seat in datas.seatData){
        seatInfo = datas.seatData[seat]
        if (!seatInfo.select){
            key = seatInfo.day+"|"+seatInfo.character
            if (!leftSeat[key]){
                leftSeat[key]={
                    "day":seatInfo.day,
                    "character":seatInfo.character,
                    "seats":[]
                }
            }
            leftSeat[key].seats.push(seatInfo.day+"|"+seatInfo.seat+"|"+seatInfo.character)
        }
    }
    goodsList=Object.keys(leftSeat).sort()
    text=""
    for(goodsI in goodsList){
        good=goodsList[goodsI]
        text+=`- `+leftSeat[good].character+"\n"
        text+=leftSeat[good].day+"\n"
        
        leftSeatInfos=leftSeat[good].seats
        for(seatsI in leftSeatInfos){
            text+=leftSeatInfos[seatsI]+"\n"
        }
    }
    text+="\n"
    document.getElementById("leftSeat").innerText=text
}
function UIUserSeat() {
    const opt = document.getElementById("userSeat");
    let text = "";

    const seatData = datas.seatData;
    const userSeat = Object.keys(datas["userSeat"]).sort();

    for (const userSeatI in userSeat) {
        const ph = userSeat[userSeatI];
        const seatList = datas.userSeat[ph];
        text += `- ${ph}<br>`; // 줄바꿈을 위해 <br> 사용

        for (const seatI in seatList) {
            const seat = seatList[seatI];
            const data = seatData[seat];
            
            if (data.select) {
                text += `<b style="color:#FF0000">${data.seat}</b><br>`; // HTML 태그로 굵게 표시
            } else {
                text += `${data.seat}<br>`;
            }
        }
    }
    opt.innerHTML = text; // innerHTML로 HTML 태그 렌더링
}
getInitList()

//~~~~~~~~~event~~~~~~~~~
document.getElementById("saveInputData").addEventListener("click",loadInputData)
document.getElementById("selectUser").addEventListener("change",userSelet)
document.getElementById("selectUserAfter1").addEventListener("click",userNext)
document.getElementById("selectUserAfter2").addEventListener("click",userNext)
document.getElementById("selectUserBefore1").addEventListener("click",userBefore)
document.getElementById("selectUserBefore2").addEventListener("click",userBefore)
document.getElementById("selectData").addEventListener("change",selectInit)
document.getElementById("saveUserData").addEventListener("click",selectSave)

