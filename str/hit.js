console.log("hit.js読み込み済み");


//重なり判定の取得と攻撃の消去
function overlap(){

    //攻撃の位置を取得
    const bullet = document.getElementsByClassName("bullet");

    //キャラの位置を取得
    const character = document.getElementsByClassName("character");

    for(let i = 0; i < bullet.length; i++){
        const b_rect = bullet[i].getBoundingClientRect();
        for(let j = 0; j < character.length; j++){
            const c_rect = character[j].getBoundingClientRect();
            // console.log(b_rect);

            //重なっているときに攻撃削除
            if((b_rect.right > c_rect.left) &&
            (b_rect.left < c_rect.right) &&
            (b_rect.top < c_rect.bottom) &&
            (b_rect.bottom > c_rect.top)){
                console.log("ダメージ")
                bullet[i].remove();
            }
        }
    }
}

setInterval(()=>overlap(), 1);

setInterval(console.clear, 30000);