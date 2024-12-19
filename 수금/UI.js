function putAll(data){
    document.getElementById("goodsName").value = data["goodsName"]
    document.getElementById("inputUser").value = data["user"]
    document.getElementById("inputSeat").value = data["seat"]
    putUserData(Object.keys(data["userSeat"]))
    putSeatData(data["userSeat"]["한놈"])
}
function putUserData(userList){
    console.log(userList)
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
    console.log(seatList)
    const sel = document.getElementById("leftSeatList")
    sel.innerHTML=''
    for (i in seatList){
        const opt = document.createElement("input")
        // opt.setAttribute("type", "text");
        opt.type="checkbox"
        opt.id = "seat"+i;
        opt.value = "seat"+i;
        sel.append(opt,seatList[i])
        const br = document.createElement("br")
        sel.append(br)


    }
}
putAll(datas)