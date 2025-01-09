// JavaScript로 file2.html의 내용을 가져와서 합치기
document.addEventListener("DOMContentLoaded", () => {
    fetch("file:///Users/jmpop/projects/work/common/common.html")
        .then(response => response.text())
        .then(data => {
            // file2의 내용을 삽입할 위치 선택
            const container = document.getElementById("common-button");
            container.innerHTML = data;
        })
        .catch(error => console.error("Error loading file2.html:", error));
});