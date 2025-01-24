async function getInitList(){
    const url = "http://127.0.0.1:8080/money/initList";
    data= await fetch(url, {
        method: "GET"
    }).then(response => {
        return response.text();
    }).then(text => {
        const data = JSON.parse(text);
        setInitList(data)
        return data
    }).catch(error => {
        window.alert(["fail"]);
    });
    return data
}
async function getInit(fileName){
    const url = "http://127.0.0.1:8080/money/loadInit";
    data= await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            fileName: fileName,
          }),
    }).then(response => {
        return response.text();
    }).then(text => {
        const data = JSON.parse(text);
        return data
    }).catch(error => {
        window.alert(["fail"]);
    });
    putInits(data)
    setCountN()
}

async function saveInit(){
    const url = "http://127.0.0.1:8080/money/saveInit";
    data= await fetch(url, {
        method: "POST",
        body: JSON.stringify(datas),
    }).then(response => {
        return response.text();
    }).then(text => {
    }).catch(error => {
        window.alert(["fail"]);
    });
    return data
}