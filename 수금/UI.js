function setInitList(data){
    const sel = document.getElementById("selectData")
    sel.innerHTML=''
    for (i in data){
        const opt = document.createElement("option")
        opt.value = i;
        opt.text = data[i].slice(0,-5);
        sel.add(opt, null);
    }
}


function putAll(data){
    document.getElementById("goodsName").value = data["goodsName"]
    document.getElementById("inputUser").value = data["user"]
    document.getElementById("inputSeat").value = data["seat"]
    putUserData(Object.keys(data["userSeat"]))
    putSeatData(data["userSeat"]["한놈"])
    
}
function putUserData(userList){
    const sel = document.getElementById("selectUser")
    sel.innerHTML=''
    for (i in userList){
        const opt = document.createElement("option")
        opt.value = i;
        opt.text = userList[i];
        sel.add(opt, null);
    }
}
function putSeatData(seatList){
    const sel = document.getElementById("leftSeatList")
    sel.innerHTML=''
    for (i in seatList){
        const opt = document.createElement("input")
        // opt.setAttribute("type", "text");
        opt.type="checkbox"
        opt.id = "seat"+i;
        opt.value = "seat"+i;
        
        text=seatList[i]
        text=seatDate[text]["seat"]+"  |  "+seatDate[text]["day"]+"  |  "+seatDate[text]["character"]
        sel.append(opt,text)
        const br = document.createElement("br")
        sel.append(br)
    }
}

function getInputUserData(){
    users=Object.keys(userData)
    putUserData(users)
}
function getInputSeatData(){
    seats=datas["userSeat"]["한놈"]
    putSeatData(seats)
}
function getInputDatas(){
    const inputUser = document.getElementById("inputUser").value
    users=inputUser.split("\n")
    const inputSeat = document.getElementById("inputSeat").value
    seats=inputSeat.split("\n")
}
function loadInputData(){
    getInputDatas()
    getInputUserData()
    getInputSeatData()
    saveInit()
}
function userSelet(){
    userI=document.getElementById("selectUser").value
    user=users[userI]
    putSeatData(datas["userSeat"][user])
}
function userNext(){
    console.log(userI)
    if (userI<users.length-1){
        userI++
    }
    user=users[userI]
    putSeatData(datas["userSeat"][user])   
}
function userBefore(){
    console.log(userI)
    if (userI>0){
        userI--
    }
    user=users[userI]
    putSeatData(datas["userSeat"][user])   
}
getInitList()

//~~~~~~~~~event~~~~~~~~~
document.getElementById("saveInputData").addEventListener("click",loadInputData)
document.getElementById("selectUser").addEventListener("change",userSelet)
document.getElementById("selectUserAfter1").addEventListener("click",userNext)
document.getElementById("selectUserAfter2").addEventListener("click",userNext)
document.getElementById("selectUserBefore1").addEventListener("click",userBefore)
document.getElementById("selectUserBefore2").addEventListener("click",userBefore)

