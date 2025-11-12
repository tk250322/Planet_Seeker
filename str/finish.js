window.go_result = function(){
    if(typeof ufo != "undefined"){
        console.log("勝ったんだ？すごいじゃん！！");
        sessionStorage.setItem("ufo_time", seconds);
    }
    move = false;
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