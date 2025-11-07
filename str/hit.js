document.addEventListener('DOMContentLoaded', function() {
  console.log("hit.js読み込み済み");
  let first = true;
  //ヒットポイント
  let enemy_hp = 10;
  let player_hp = 5;

  // playerの無敵時間
  let player_hit_pos = true;
  // enemyの無敵時間
  let enemy_hit_pos = true;

  // playerの点滅
  window.player_blinking = true;
  // enemyの点滅
  window.enemy_blinking = true;

  // playerの点滅処理
  function player_display_change (){
    const player_system = setInterval(() => {
      window.player_blinking = !window.player_blinking;
      console.log("変化");
    }, 50);
    setTimeout(() => {
      clearInterval(system);
      player_hp != 0 ? window.player_blinking = true : window.player_blinking = false;
    }, 1000);
  }

  function enemy_display_change (){
    const enemy_system = setInterval(() => {
      window.enemy_blinking = !window.enemy_blinking;
      console.log("enemy変化");
    }, 50);
    setTimeout(() => {
      clearInterval(enemy_system);
      window.enemy_blinking = true;
    }, 1000);
  }

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
    const hp_style = document.getElementById("HP");
    let hp_height = parseInt(hp_style.style.height || "150" , 10);

    //enemyの当たり判定取得
    let enemy;
    let enemyRect;
    if(typeof enemy_start === "function"){
      enemy = document.getElementById("enemy-pos");
      enemyRect = enemy.getBoundingClientRect();
    }
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

      
      
      if (hit && player_hit_pos) {
        console.log("ダメージ");
        player_hit_pos = false;
        e_b.remove();
        player_hp--;
        hp_height -= 30;
        hp_style.style.height = `${hp_height}px`;
        player_display_change();
        setTimeout(()=>{
          player_hit_pos = true;
        }, 1300);
      }
    }

    //ヒット処理
    if(typeof enemy_start === "function")for (let i = 0; i < player_bullets.length; i++) {
      const p_b = player_bullets[i];
      const bulletRect = p_b.getBoundingClientRect();

      //当たったらtrue
      const hit =
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left &&
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top;

      if (hit && enemy_hit_pos) {
        console.log("ヒット");
        enemy_hit_pos = false;
        p_b.remove();
        enemy_hp--;
        enemy_display_change();
        setTimeout(() => {
          enemy_hit_pos = true;
        }, 1300);
        player_blinking = true;
      }
    }

    //勝利
    if(enemy_hp == 0 && first){
      //処理の重複防止
      first = false;
      attackloop = false;
      
      //攻撃削除
      bullet_remove();

      //リザルトへ移動
      requestAnimationFrame(()=>{
            go_result();
      });
    }

    //敗北
    if(player_hp == 0 && first){
      first = false;
      attackloop = false;
      
      bullet_remove();

      requestAnimationFrame(()=>{
        setTimeout(()=>{
          gameover();
        }, 800);
      });

    }

  }

  //描画処理
  window.hit_start = function(){
    setInterval(()=>overlap(), 16);

    setInterval(console.clear, 30000);
  }
});