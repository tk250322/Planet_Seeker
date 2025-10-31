document.addEventListener('DOMContentLoaded', function() {
  console.log("hit.js読み込み済み");
  let first = true;
  //ヒットポイント
  let enemy_hp = 10;
  let player_hp = 5;

  //攻撃削除
  function bullet_remove(){
      const enemy_bullets = document.getElementsByClassName("enemy_bullet");
      const player_bullets = document.getElementsByClassName("player_bullet");
      Array.from(player_bullets).forEach(e => {
        e.remove();
      });
      Array.from(enemy_bullets).forEach(e => {
        e.remove();
      });
  }

  //重なり判定の取得と攻撃の消去
  function overlap() {
    //攻撃の取得
    const enemy_bullets = document.getElementsByClassName("enemy_bullet");
    const player_bullets = document.getElementsByClassName("player_bullet");

    //playerの当たり判定取得
    const player = document.getElementById("player-pos");
    const playerRect = player.getBoundingClientRect();

    //プレイヤーのHPスタイル取得
    // const hp_style = doqument.getElementById("HP");
    // let hp_height = parseInt(hp_style.style.height || "100", 10);

    //enemyの当たり判定取得
    const enemy = document.getElementById("enemy-pos");
    const enemyRect = enemy.getBoundingClientRect();

    //ダメージ処理
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
        player_hp--;
        // hp_height -= 30;
        // hp_style.style.height = `${hp_height}px`;
      }
    }

    //ヒット処理
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

    //勝利
    if(enemy_hp == 0 && first){
      //処理の重複防止
      first = false;
      
      //攻撃削除
      bullet_remove();

      //リザルトへ移動
      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          if(confirm("勝利")){
            go_reslt();
            window.location.href = "result.html"
          }
        })
      });
    }

    //敗北
    if(player_hp == 0 && first){
      first = false;

      bullet_remove();

      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          if(confirm("敗北")){
            go_reslt();
            window.location.href = "result.html"
          }
        })
      });

    }

  }

  //リザルトへ移動
  function go_reslt(){
    console.log("result");
  }

  //描画処理
  window.hit_start = function(){
    setInterval(()=>overlap(), 16);

    setInterval(console.clear, 30000);
  }
});