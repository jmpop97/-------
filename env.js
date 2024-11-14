nickname="홍씨"
phone="01048813987"
ms1=massage1("")
function massage1(goodsName){
    ms1=`
    ----------------------------------
    
    안녕하세요! "${nickname}"입니다.
    
    이번 [${goodsName}]
    진행하게 되었습니다.
    
    잘부탁드립니다.
    
    좋은티켓 드리기위해
    최선을 다하겠습니다.
    
    ${phone}
    ----------------------------------
    `
    return ms1
}
