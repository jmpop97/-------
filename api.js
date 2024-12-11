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
    putInits(data)
    setValues()
}

async function saveInit(inits){
    const url = "http://127.0.0.1:8080/saveInit";
    data= await fetch(url, {
        method: "POST",
        body: JSON.stringify(inits),
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

async function getProductData(id){
    const url = "http://127.0.0.1:8080/productData";
    data= await fetch(url, {
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
        console.warn(error);
    });
    putProductId(data)
}
async function getDiscountData(id){
    const url = "http://127.0.0.1:8080/discountData";
    data= await fetch(url, {
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
        console.warn(error);
    });
    console.log(data)
    settingDiscount(data)
}
async function getAlertData(alertUrl){
    const url = "http://127.0.0.1:8080/alertData";
    data= await fetch(url, {
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
        console.warn(error);
    });
    siteUrl=data["url"]
    delete data["url"]
    settingAlertData(data)
    settingSiteUrl(siteUrl)
    loadProductData()
}