{
    function updateOpenNewWindowLink() {
        //url업데이트
        const siteUrl = document.getElementById("siteUrl").value;
        const goodsCode = siteUrl.split('/').pop(); // URL 마지막 값 추출
        
        const place = document.getElementById("place").value;
        const placeCode = place.split(' ').pop();
        
        const newUrl = `https://poticket.interpark.com/Ticket/Seat/BookingSeatDetail.asp?GoodsCode=${goodsCode}&PlaceCode=${placeCode}&TmgsOrNot=D2003&LocOfImage=&Tiki=&BizCode=Webbr&PlaySeq=001&SessionId=&Block=001`;
        const openNewWindowButton = document.getElementById("firstUrl");
        const openNewWindowName = document.getElementById("firstUrlName");
        openNewWindowButton.href = newUrl;
        openNewWindowName.textContent = newUrl;
    }
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
            console.log(tileStruct)
            tile=tileStruct.join('"')
            tiles.push(tile)
        }
        tiles=tiles.join("\n")
        navigator.clipboard.writeText(tiles)
    }

}

//input
{
    document.getElementById("exclusive").addEventListener("input", function() {
        document.getElementById("previewExclusive").textContent = this.checked ? "Y" : "N";
    });
    document.getElementById("openNotice").addEventListener("input", function() {
        document.getElementById("previewOpenNotice").textContent = this.checked ? "Y" : "N";
    });
    document.getElementById("openDate").addEventListener("input", function() {
        document.getElementById("previewOpenDate").textContent = this.value;
    });
    document.getElementById("eventPeriod").addEventListener("input", function() {
        document.getElementById("previewEventPeriod").textContent = this.value;
    });
    document.getElementById("snsUrl").addEventListener("input", function() {
        document.getElementById("previewSnsUrl").textContent = this.value;
    });
    document.getElementById("siteUrl").addEventListener("input", function() {
        document.getElementById("previewSiteUrl").textContent = this.value;
    });
    document.getElementById("place").addEventListener("input", function() {
        urlname=this.value;
        document.getElementById("previewPlace").textContent = urlname;
        goodsCode=urlname.slace(-8)
        first_url="https://poticket.interpark.com/Ticket/Seat/BookingSeatDetail.asp?GoodsCode="+goodsCode+"&PlaceCode="+placeCode+"&TmgsOrNot=D2003&LocOfImage=&Tiki=&BizCode=Webbr&PlaySeq=001&SessionId=&Block=001"
        document.getElementById("firstUrl").textContent=first_url
        document.getElementById("firstUrl").href=first_url
    });
    document.getElementById("discount").addEventListener("input", function() {
        document.getElementById("previewDiscount").textContent = this.value;
    });
    document.getElementById("seatGradeStart").addEventListener("input", updateSeatGradePreview);
    document.getElementById("seatGradeEnd").addEventListener("input", updateSeatGradePreview);
    
    document.getElementById("title").addEventListener("input", function() {
        massage1(this.value);
    });

    document.getElementById("siteUrl").addEventListener("input", updateOpenNewWindowLink);
    document.getElementById("place").addEventListener("input", updateOpenNewWindowLink);
    document.getElementById("copyButton").addEventListener("click", copyNewUrl);
    document.getElementById("copyButton2").addEventListener("click", copyTile);

}


// 엔터키 checkbox
checkids=["exclusive","openNotice"]
{
    for (i in checkids){
        setCheckbox(checkids[i])
    }
    // 초기 로딩 시 링크 설정
}

updateOpenNewWindowLink();