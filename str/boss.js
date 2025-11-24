document.addEventListener("DOMContentLoaded", function() {
    
    const game_area = document.getElementById("game_play_area");
    const enemy_canvas = document.getElementById("enemycanvas");
    const ctx_enemy = enemy_canvas.getContext("2d");

    // 画像id取得
    const boss_attack_effect = document.getElementById("boss_attack");
    const boss_attack_display = document.getElementById("boss_attack_display");
    const enemy = document.getElementById("enemy");
    const destroy = document.getElementById("Destroy");
    const enemy_attack_sprite = document.getElementById("enemy_attack_sprite");
    
    // 幅と大きさ
    const enemy_wide = 160;
    const enemy_high = 160;

    // 敵の初期位置設定
    let enemyX = enemy_canvas.width / 2 - 80;
    let enemyY = 0;

    // 移動設定
    let enemy_left = false;
    let enemy_right = false;
    // 敵の移動速度
    let enemyspeed = 2;

    let enemy_attacking = false;
    let attackloop = true;
    let move = true;

    // enemy当たり判定
    const enemy_hit = document.createElement("div");
    enemy_hit.id = "enemy-pos";
    enemy_hit.style.position = "absolute";
    game_area.appendChild(enemy_hit);
    enemy_hit.style.height  = "50px";
    enemy_hit.style.width = "50px";
    enemy_hit.style.left = `${enemyX + 55}px`;
    enemy_hit.style.top = `${enemyY + 55}px`;
    enemy_hit.style.border = "2px dashed line";
    enemy_hit.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
    
    function boss_movement(){
        if(window.isGamePaused){
            requestAnimationFrame(boss_movement);
            // 描画・更新せずに終了
            return ;
        }

        // キャンバスをクリア
        ctx_enemy.clearRect(0, 0, enemy_canvas.width, enemy_canvas.height);

        // 描画位置を更新する
        update();

        if(typeof window.win_player !== "undefined" && window.win_player){
            if(typeof window.enemy_blinking !== "undefined" && window.enemy_blinking){
                if(enemy_attacking && enemy_attack_sprite){
                    ctx_enemy.drawImage(enemy_attack_sprite, enemyX, enemyY, enemy_wide, enemy_high);
                }
                else{
                    ctx_enemy.drawImage(enemy, enemyX, enemyY, enemy_wide, enemy_high);                    
                }
            }
        }
        else if(typeof window.win_player !== "undefined" && !window.win_player){
            ctx_enemy.drawImage(destroy, enemyX, enemyY, enemy_wide, enemy_high);            
        }

        // 繰り返して描画する
        requestAnimationFrame(boss_movement);
    }

    function update() {
        // 左に動かす条件
        if(enemy_left && enemyX > 0){
            enemyX -= enemyspeed;
        }
        // 右へ動かす条件
        if(enemy_right && enemyX + enemy_wide < enemy_canvas.width){
            enemyX += enemyspeed;
        }
        enemy_hit.style.left = `${enemyX + 52}px`;
        enemy_hit.style.top = `${enemyY + 65}px`;
    }

    function boss_attack(){
        // プレイヤーが死んだ後に攻撃を発射しない
        if(!attackloop){
            return;
        }

        enemy_attacking = true;

        // 敵の音楽再生
        enemyAttackSound.currentTime = 0;
        enemyAttackSound.play();

        // 弾の形
        const attack = document.createElement("img");

        // 画像の取得
        attack.src = "../assets/images/enemy_attack.png";

        attack.className = "enemy_bullet";
        attack.style.position = "absolute";

        const bulletWidthHalf = 15;

        // 弾の位置を計算
        attack.style.left = `${enemyX + (enemy_wide / 2) - bulletWidthHalf}px`;
        attack.style.top = `${enemyY + (enemy_high / 2)}px`;

        game_area.appendChild(attack);

        const move_interval = setInterval(() => {
            if(window.isGamePaused){
                return;
            }
            const currentTop = parseInt(attack.style.top);
            attack.style.top = `${currentTop + enemyspeed}px`;

            if(currentTop > 636){
                clearInterval(move_interval);
                attack.remove();
            }
        }, 16);

        setTimeout(() => {
            enemy_attacking = false;
        }, 500);
    }

    // 乱数設定
    function randomNumber(max = 3){
        return Math.floor(Math.random() * max);
    }

    function random_move(){
        if(window.isGamePaused){
            return;
        }

        enemy_left = false;
        enemy_right = false;

        if(move){
            const r = randomNumber();
            enemy_left = r === 1;
            enemy_right = r === 2;
        }
    }

        //攻撃のランダム生成
    function attack_schedule(){
        const delay = (randomNumber() + 1.5)*400;
        setTimeout(()=>{
            if (!window.isGamePaused) {
            boss_attack();
            }
            attack_schedule();
        }, delay);
    }

    window.enemy_start = function (){
        random_move();
        setInterval(random_move, 200);

        setTimeout(attack_schedule, 3000);
    }

    boss_movement();
});