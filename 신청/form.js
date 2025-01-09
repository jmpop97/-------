function massage1(goodsName){
    ms1=`
    안녕하세요! "${nickname}"입니다.
    
    이번 [${goodsName}]
    진행하게 되었습니다.
    
    잘부탁드립니다.
    
    좋은티켓 드리기위해
    최선을 다하겠습니다.
    `
    return ms1
}
function seatImgUrl(){
    setInits()
    goodsCode =inits["siteUrl"].split('/').pop()
    placeCode=inits["place"].split(' ').pop()
    first_url="https://poticket.interpark.com/Ticket/Seat/BookingSeatDetail.asp?GoodsCode="+goodsCode+"&PlaceCode="+placeCode+"&TmgsOrNot=D2003&LocOfImage=&Tiki=&BizCode=Webbr&PlaySeq=001&SessionId=&Block=001"
    return first_url
}