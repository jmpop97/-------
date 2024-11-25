async function getInitList(){
    const url = "http://127.0.0.1:8080/initList";
    data= await fetch(url, {
        method: "GET"
    }).then(response => {
        return response.text();
    }).then(text => {
        const data = JSON.parse(text);
        setInitList(data)
        return data
    }).catch(error => {
        console.warn(error);
    });
    return data
}

async function getInit(fileName){
    const url = "http://127.0.0.1:8080/loadInit";
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
        console.warn(error);
    });
    return data
}