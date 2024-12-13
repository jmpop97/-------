function putAll(data){
    document.getElementById("goodsName").value = data["goodsName"]
    document.getElementById("inputUser").value = data["user"]
    document.getElementById("inputSeat").value = data["seat"]

}

putAll(datas)