console.log("hit.js読み込み済み");


//重なり判定の取得と攻撃の消去
function overlap() {
  const bullets = document.getElementsByClassName("bullet");
  const player = document.getElementById("player-pos");
  const playerRect = player.getBoundingClientRect();

  for (let i = 0; i < bullets.length; i++) {
    const b = bullets[i];
    const bulletRect = b.getBoundingClientRect();

    //当たったらtrue
    const hit =
      bulletRect.left < playerRect.right &&
      bulletRect.right > playerRect.left &&
      bulletRect.top < playerRect.bottom &&
      bulletRect.bottom > playerRect.top;

    if (hit) {
      console.log("ダメージ");
      b.remove();
    }
  }
}
setInterval(()=>overlap(), 16);

setInterval(console.clear, 30000);