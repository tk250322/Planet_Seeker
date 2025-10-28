console.log("hit.js読み込み済み");

//ヒットポイント
let enemy_hp = 10;

//重なり判定の取得と攻撃の消去
function overlap() {
  const enemy_bullets = document.getElementsByClassName("enemy_bullet");

  //playerの当たり判定取得
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
  const player_bullets = document.getElementsByClassName("player_bullet");

  //enemyの当たり判定取得
  const enemy = document.getElementById("enemy-pos");
  const enemyRect = enemy.getBoundingClientRect();

  for (let i = 0; i < player_bullets.length; i++) {
    const p_b = player_bullets[i];
    const bulletRect = p_b.getBoundingClientRect();

    //当たったらtrue
    const hit =
      bulletRect.left < enemyRect.right &&
      bulletRect.right > enemyRect.left &&
      bulletRect.top < enemyRect.bottom &&
      bulletRect.bottom > enemyRect.top;

    if (hit) {
      console.log("ヒット");
      p_b.remove();
      enemy_hp--;
    }
  }

  if(enemy_hp == 0){
    alert("勝利");

  }

}
setInterval(()=>overlap(), 16);

setInterval(console.clear, 30000);