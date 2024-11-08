checkids=["exclusive","openNotice"]
// 제출
document.getElementById("ticketForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
});

// enter시 체크박스
for (i in checkids){
    setCheckbox(checkids[i])
}
function setCheckbox(id){
    const checkbox = document.getElementById(id);
    // Enter 키를 눌렀을 때 체크 상태 전환
    
    checkbox.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // 기본 Enter 동작 방지
            checkbox.checked = !checkbox.checked;
            checkbox.value = checkbox.checked ? "Y" : "N";
        }
    });
    // 체크 상태가 변경될 때 값 설정
    checkbox.addEventListener("change", function() {
        checkbox.value = checkbox.checked ? "Y" : "N";
    });

}