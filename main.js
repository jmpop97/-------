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
    function stringJson(){
        sj=`{"seatGrade":"1","floor":"1층","rowNo":"A열","seatNo":"5","blockNo":"001"},`
        
        return sj
    }
    function copyTile(){
        tiles=[]
        tileInit=document.getElementById("seatGradeStart")
        tileEnd=document.getElementById("seatGradeEnd")
        tileInitStruct=tileInit.value.split('"')
        tileEndStruct=tileEnd.value.split('"')
        for (i=tileInitStruct[15]*1;i<=tileEndStruct[15]*1;i++){
            tileStruct=tileInitStruct
            tileStruct[15]=i
            tile=tileStruct.join('"')
            tiles.push(tile)
        }
        tiles=tiles.join("\n")
        navigator.clipboard.writeText(tiles)
    }
    //~~~~~~~~~~~~~~~~~~~
    function setValue(id){
        document.getElementById(id).value=inits[id]
        
    }
    function setBool(id){
        document.getElementById(id).checked=inits[id]
    }
    function setValues(){
        value_ids=["exclusive","openNotice","openDate","eventPeriod","snsUrl","siteUrl","place","discount","seatGradeStart","seatGradeEnd","seatGradeEnd","title"]        
        bool_ids=["exclusive","openNotice"]
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
}
//input
{
    document.getElementById("saveJson").addEventListener("click", function() {
        setInits()
        saveInit(inits)
        getInitList()
    });
    document.getElementById("firstUrl").addEventListener("click", function() {
    firsturl=seatImgUrl()
    window.open(firsturl)
    })
    document.getElementById("Message").addEventListener("click", copyNewUrl);
    document.getElementById("tiles").addEventListener("click", copyTile);
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
