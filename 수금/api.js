async function getInitList(){
    const url = "http://127.0.0.1:8080/money/";
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