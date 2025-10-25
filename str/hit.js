console.log("hit.js読み込み済み");


//重なり判定の取得と攻撃の消去
function overlap() {
  const enemy_bullets = document.getElementsByClassName("enemy_bullet");

  const player = document.getElementById("player-pos");
  const playerRect = player.getBoundingClientRect();

  for (let i = 0; i < enemy_bullets.length; i++) {
    const e_b = enemy_bullets[i];
    const bulletRect = e_b.getBoundingClientRect();

    //当たったらtrue
    const hit =
      bulletRect.left < playerRect.right &&
      bulletRect.right > playerRect.left &&
      bulletRect.top < playerRect.bottom &&
      bulletRect.bottom > playerRect.top;

    if (hit) {
      console.log("ダメージ");
      e_b.remove();
    }
  }
}
setInterval(()=>overlap(), 16);

setInterval(console.clear, 30000);