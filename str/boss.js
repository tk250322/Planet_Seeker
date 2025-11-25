document.addEventListener('DOMContentLoaded', function() {
    window.boss = "boss.js読み込み完了";
    console.log("enemy.js読み込み済み");

    const game_area  = document.getElementById("game_play_area")
    const enemycanvas = document.getElementById('enemycanvas');
    const enemyctx = enemycanvas.getContext('2d');

    // 敵の攻撃サウンド
    const enemyAttackSound = new Audio('../assets/sounds/effects/enemy_attack.mp3'); 
    enemyAttackSound.preload = 'auto';
    enemyAttackSound.volume = 0.5;
    const enemypredictionSound = new Audio('../assets/sounds/effects/prediction.mp3'); 
    enemypredictionSound.preload = 'auto';
    const enemylaserSound = new Audio('../assets/sounds/effects/laser.mp3'); 
    enemylaserSound.preload = 'auto';

    //敵のidを取得
    const enemy = document.getElementById("enemy");
    const destroy = document.getElementById("Destroy");
    const enemyAttackSprite = document.getElementById("enemy_attack_sprite");
    // 敵の幅と高さ
    const enemyWidth = 160;
    const enemyHeight = 160;

    // 敵の初期位置設定
    let enemyX = enemycanvas.width / 2 - 80;
    let enemyY = 0;    

    // 敵の移動速度設定
    let enemyspeedX = 2;

    //enemy当たり判定
    const enemy_hit = document.createElement("div");
    enemy_hit.id = "enemy-pos";
    enemy_hit.style.position = "absolute";
    game_area.appendChild(enemy_hit);
    enemy_hit.style.height = "50px";
    enemy_hit.style.width = "50px";
    enemy_hit.style.left = `${enemyX + 55}px`;
    enemy_hit.style.top = `${enemyY + 55}px`;
    // enemy_hit.style.border = "2px dashed lime";
    // enemy_hit.style.backgroundColor = "rgba(0, 255, 0, 0.2)";

    let isEnemyAttacking = false;

    function enemydraw() {
        //メインループの停止
        if (window.isGamePaused) {
            requestAnimationFrame(enemydraw); // ループの再開に備えて要求だけは続ける
            return; // 描画も更新もせずに終了
        }
        // キャンバスをクリアにする
        enemyctx.clearRect(0, 0, enemycanvas.width, enemycanvas.height);
            
        // 描画位置を更新する
        update();

        if(typeof window.win_player !== "undefined" && window.win_player){
            if(typeof enemy_blinking !== "undefined" && enemy_blinking){
                // 点滅OK（描画する）なら、次に「攻撃中か」を判定する
                if (isEnemyAttacking && enemyAttackSprite) {
                    // 点滅中 ＆ 攻撃中のスプライトを描画
                    enemyctx.drawImage(enemyAttackSprite, enemyX, enemyY, enemyWidth, enemyHeight);
                } 
                else {
                    // 点滅中 ＆ 通常時のスプライトを描画
                    enemyctx.drawImage(enemy, enemyX, enemyY, enemyWidth, enemyHeight);
                }                
            }

        }
        else if(typeof window.win_player !== "undefined" && !window.win_player){
            enemyctx.drawImage(destroy, enemyX, enemyY, enemyWidth, enemyHeight);
        }

        // 繰り返してアニメーションする
        requestAnimationFrame(enemydraw);
    }

    function update() {
        // 左へ動かす条件
        if (enemyLeft && enemyX > 0){
            enemyX -= enemyspeedX;
        }
        // 右へ動かす条件
        if (enemyRigth && enemyX + enemyWidth < enemycanvas.width){
            enemyX += enemyspeedX;
        }
        enemy_hit.style.left = `${enemyX + 52}px`;
        enemy_hit.style.top = `${enemyY + 65}px`;
    }

    //攻撃の実装
    function enemy_attack(){
        console.log("攻撃モーション開始！");
        //プレイヤーが死んだ後に攻撃を発射しない
        if(!attackloop)return;
        
        isEnemyAttacking = true;
        
        // 敵のサウンドを再生する
        enemyAttackSound.currentTime = 0; // 連射できるように再生位置をリセット
        enemyAttackSound.play();

        // 球の形
        const attack = document.createElement("img");
        
        //画像の取得
        attack.src = "../assets/images/enemy_attack.png";
        
        attack.className = "enemy_bullet";
        attack.style.position = "absolute";

        const bulletWidthHalf = 15; 

        // 3. 弾の位置を計算
        attack.style.left = `${enemyX + (enemyWidth / 2) - bulletWidthHalf}px`;
        attack.style.top = `${enemyY + (enemyHeight / 2)}px`;

        game_area.appendChild(attack);
        console.log("敵が攻撃を発射");

        const speed = 5;

        // 常に拡散攻撃(3方向)を実行
        {
            let check_attack1 = true;
            let check_attack2 = true;

            const attack1 = attack.cloneNode(true);
            const attack2 = attack.cloneNode(true);

            game_area.appendChild(attack1);
            game_area.appendChild(attack2);

            const diagonal_move= setInterval(() => {
            if (window.isGamePaused) {
                return;
            }
            const top1 = parseInt(attack1.style.top);
            const left1 = parseInt(attack1.style.left);
            const top2 = parseInt(attack2.style.top);
            const left2 = parseInt(attack2.style.left);
            attack1.style.top = `${top1 + speed - 1}px`;
            attack2.style.top = `${top2 + speed -1}px`;
                                            
            if(check_attack1){
                attack1.style.left = `${left1 - speed + 2}px`;
                check_attack1 = left1 >= 0? true : false;
            }
            else attack1.style.left = `${left1 + speed - 2}px`;
            if(check_attack2){
                attack2.style.left = `${left2 + speed - 2}px`;
                check_attack2 = left2 <= 570? true : false;
            }
            else attack2.style.left = `${left2 - speed + 2}px`;
            if (top1 > 636 || top2 > 636) {
                clearInterval(diagonal_move);
                attack1.remove();
                attack2.remove()
            }
            }, 16);

        }
        
        const move = setInterval(() => {
            if (window.isGamePaused) {
                return;
            }
            const currentTop = parseInt(attack.style.top);
            attack.style.top = `${currentTop + speed}px`;

            if (currentTop > 636) {
                clearInterval(move);
                attack.remove();
            }
        }, 16);

        setTimeout(() => {
            isEnemyAttacking = false;
        }, 500);
    }

    //移動設定
    let enemyLeft = false;
    let enemyRigth = false;

    //乱数生成
    function randomNamber(){
        const r = Math.floor(Math.random() * 3);
        return r;
    }

    let join = true;
    //移動処理
    function randomMove(){
        if (window.isGamePaused) {
            return;
        }
        enemyLeft = false;
        enemyRigth = false;

        if(move){
            const r = randomNamber();
            enemyLeft = r === 1;
            enemyRigth = r === 2;
        }
        if(typeof ufo != "undefined" && enemy_hp == 2 && join){
            console.log("応援");
            join = false;
            
        }
    }

    //攻撃のランダム生成
    function attack_schedule(){
        const delay = (randomNamber() + 1.5)*700;
        setTimeout(()=>{
            if (!window.isGamePaused) {
            enemy_attack();
            }
            attack_schedule();
        }, delay);
    }

    window.enemy_start = function (){
            randomMove();
            setInterval(randomMove, 200);

            setTimeout(attack_schedule, 0);
        }
    enemydraw();
});