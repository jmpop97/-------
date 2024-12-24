async function saveInit(inits){
    const url = "http://127.0.0.1:8080/money/saveInit";
    data= await fetch(url, {
        method: "POST",
        body: JSON.stringify(datas),
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