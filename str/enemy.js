console.log("enemy.js読み込み済み");
const enemy = document.getElementById("enemy");

function keydown(){
    document.addEventListener("keydown", function(e){
    // console.log("キーが押されました。 e.key の値:", e.key);
    if(e.code === "Space"){
        console.log("spaseが押されました");
        enemy_attack();
    }
})
}

//撃の実装
function enemy_attack(){
    // 球の形
    const attack = document.createElement("img");
    attack.src = "../assets/images/enemy_attack.png";
    attack.className = "enemy_bullet";
    attack.style.position = "absolute";

    //敵の位置を取得
    const enemy_pos = enemy.getBoundingClientRect();

    //球の位置
    attack.style.left = `${enemy_pos.left + enemy_pos.width/2 - 50}px`;
    attack.style.top = `${enemy_pos.bottom}px`;

    document.body.appendChild(attack);
    console.log("敵が攻撃を発射");



}

keydown();

// const fireInterval = 2000;

// // 弾の発射処理
// function fireBullet() {
//   const bullet = document.createElement("img");
//   bullet.src = "../../assets/images/enemy_attack.png";
//   bullet.className = "enemy-bullet";
//   bullet.style.position = "absolute";

//   // 敵の位置に合わせて弾を配置
//   const enemyRect = enemy.getBoundingClientRect();
//   bullet.style.left = `${enemyRect.left + enemyRect.width / 2 - 5}px`;
//   bullet.style.top = `${enemyRect.bottom}px`;

//   document.body.appendChild(bullet);

//   // 弾の移動処理
//   const speed = 4;
//   const move = setInterval(() => {
//     const currentTop = parseInt(bullet.style.top);
//     bullet.style.top = `${currentTop + speed}px`;

//     // 画面外に出たら削除
//     if (currentTop > window.innerHeight) {
//       clearInterval(move);
//       bullet.remove();
//     }
//   }, 16); // 約60fps
// }

// // 一定間隔で攻撃
// setInterval(fireBullet, fireInterval);
