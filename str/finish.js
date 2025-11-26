window.go_result = function(){
    let clearStatus = "default_clear"; // デフォルトの目印

    if(typeof ufo != "undefined"){
        sessionStorage.setItem("ufo_time", seconds);
        clearStatus = "ufo_clear"; // ★UFOクリアの目印
    }

    else if (typeof debris != "undefined") {
        clearStatus = "debris_clear"; // ★デブリクリアの目印
        sessionStorage.setItem("debris_score", score);
    }

    // ボスステージの判定
    if(typeof ufo == "undefined" && typeof debris == "undefined"){
        console.log("勝ったんだ？すごいじゃん！！");
        sessionStorage.setItem("boss_time", seconds);
        clearStatus = "boss_clear"; // ★ボスクリアの目印
    }

    move = false;
    const screen = document.getElementById("win-screen");
    screen.style.display = "block";
    screen.addEventListener("click",()=>{
        // ★★★ ここのURLを修正 ★★★
        // 目印（clearStatus）を付けて result.html に遷移
        console.log("crear");
        window.location.href = `result.html?status=${clearStatus}`;
    });
}

window.gameover = function(){
    console.log("負けたねー😊");
    move = false;
    const screen = document.getElementById("gameover-screen");
    screen.style.display = "block";
    screen.addEventListener("click",()=>{
        window.location.href = "../index.html";
    });
}