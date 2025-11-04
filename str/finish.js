window.go_result = function(){
    console.log("勝ったんだ？すごいじゃん！！");
    const screen = document.getElementById("win-screen");
    screen.style.display = "block";
    screen.addEventListener("click",()=>{
        window.location.href = "result.html";
    })
}
window.gameover = function(){
    console.log("負けたねー😊");
    move = false;
    const screen = document.getElementById("gameover-screen");
    screen.style.display = "block";
    screen.addEventListener("click",()=>{
        window.location.href = "Title.html";
    });

}