document.addEventListener('DOMContentLoaded', function() {
  console.log("hit.js読み込み済み");
  let first = true;
  
  //ヒットポイント
  window.enemy_hp = 4;
  window.player_hp = 5;

  //プレイヤーのHPスタイル取得
  const hp_style = document.getElementById("HP");
  const hp_child = hp_style.children;

  //プレイヤー、エネミーの被弾効果音
  const playerDamageSound = new Audio('../assets/sounds/effects/player_damage.mp3');
  playerDamageSound.preload = 'auto';
  playerDamageSound.volume = 1; 
  const enemyHitSound = new Audio('../assets/sounds/effects/enemy_damage.mp3');
  enemyHitSound.preload = 'auto';
  enemyHitSound.volume = 0.9;
  window.enemydownSound = new Audio('../assets/sounds/effects/enemy_down.mp3'); 
  enemydownSound.preload = 'auto';
  enemydownSound.volume = 0.8;

  //勝利効果音
  window.bgmWin = new Audio('../assets/sounds/effects/victory.mp3'); 
  bgmWin.preload = 'auto';
  bgmWin.volume = 0.8
  bgmWin.loop = false; // ループ再生

  for(let i = 0; i < hp_child.length; i++){
    hp_child[i].src = "../assets/images/player_life.png"
    hp_child[i].style.left = `${10 + 22 * i}px`
    hp_child[i].style.bottom = "10px";
  }


  // playerの無敵時間
  window.player_hit_pos = true;
  // enemyの無敵時間
  let enemy_hit_pos = true;

  // playerの点滅
  window.player_blinking = true;
  // enemyの点滅
  window.enemy_blinking = true;

  // 勝利、敗北判定
  window.win_player = true;
  window.lose_player = true;

  // playerの点滅処理
  function player_display_change (){
    const player_system = setInterval(() => {
      window.player_blinking = !window.player_blinking;
      console.log("変化");
    }, 50);
    setTimeout(() => {
      clearInterval(player_system);
      window.player_blinking = true;
      if(!move)player_blinking = true;

    }, 1000);
  }

  // enemyの点滅処理
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
      const enemy_lasers = document.getElementsByClassName("enemy_laser");
      Array.from(player_bullets).forEach(e => {
        e.remove();
      });
      Array.from(enemy_bullets).forEach(e => {
        e.remove();
      });
      Array.from(enemy_lasers).forEach(e => {
        e.remove();
      });
  }

  //ダメージ
  window.damage = function(){
    console.log("ダメージ");
    // プレイヤー被弾サウンドを再生
    playerDamageSound.currentTime = 0;
    playerDamageSound.play();
    player_hit_pos = false;
    if(typeof enemy_start === "function")e_b.remove();
    player_hp--;
    // hp_height -= 30;
    // hp_style.style.height = `${hp_height}px`;
    hp_child[player_hp].remove();
    player_display_change();
    setTimeout(()=>{
      player_hit_pos = true;
    }, 1300);
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
    // const hp_style = document.getElementById("HP");
    // let hp_height = parseInt(hp_style.style.height || "150" , 10);

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
        // プレイヤー被弾サウンドを再生
        playerDamageSound.currentTime = 0;
        playerDamageSound.play();
        player_hit_pos = false;
        e_b.remove();
        player_hp--;
        // hp_height -= 30;
        // hp_style.style.height = `${hp_height}px`;
        hp_child[player_hp].remove();
        player_display_change();
        setTimeout(()=>{
          player_hit_pos = true;
        }, 1300);
      }
    }

    //レーザーの当たり判定
    const enemy_lasers = document.getElementsByClassName("enemy_laser");
    for (let i = 0; i < enemy_lasers.length; i++) {
      const laser = enemy_lasers[i];
      const laserRect = laser.getBoundingClientRect();

      // チャージ中（細い線）は無視する（幅10px未満なら判定しない）
      if (laserRect.width < 10) continue;

      const hit =
        laserRect.left < playerRect.right &&
        laserRect.right > playerRect.left &&
        laserRect.top < playerRect.bottom &&
        laserRect.bottom > playerRect.top;

      if (hit && player_hit_pos) {
        console.log("レーザー被弾");
        playerDamageSound.currentTime = 0;
        playerDamageSound.play();
        player_hit_pos = false;
        
        // レーザーは貫通するので remove() はしない
        
        player_hp--;
        if(hp_child[player_hp]) hp_child[player_hp].remove();
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
        // 敵被弾サウンドを再生
        enemyHitSound.currentTime = 0;
        enemyHitSound.play();
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
      move = false;

      //攻撃削除
      bullet_remove();

      // 現在のゲームBGMを停止 (scenario.jsのbgmGameがwindow.bgmGameである前提)
      if (window.bgmGame) {
        window.bgmGame.pause();
        window.bgmGame.currentTime = 0;
      }
      
      if(typeof ufo !== "undefined" || typeof debris !== "undefined"){
      // 撃破画像に変更
        window.win_player = false;
        setTimeout(() => {
          //リザルトへ移動          
            requestAnimationFrame(()=>{
              go_result();
              // 勝利BGMを再生
              bgmWin.play().catch(e => {});
            });
          
        }, 500);}
      else{
        currentMessageIndex = 0;
        activeMessages = endMessages;
        gameHasStarted = false;
        document.getElementById("textbox").style.display = "block";
        initRevealTextMessage(endMessages[currentMessageIndex]);
      }
  

    }

    //敗北
    if(player_hp == 0 && first){
      first = false;
      attackloop = false;  
      window.lose_player = false;    
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