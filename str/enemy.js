document.addEventListener('DOMContentLoaded', function() {
    console.log("enemy.js読み込み済み");

    const game_area  =document.getElementById("game_play_area")
    const enemycanvas = document.getElementById('enemycanvas');
    const enemyctx = enemycanvas.getContext('2d');

    //敵のidを取得
    const enemy = document.getElementById("enemy");

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
    enemy_hit.style.border = "2px dashed lime";
    enemy_hit.style.backgroundColor = "rgba(0, 255, 0, 0.2)";


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

        if(typeof enemy_blinking !== "undefined")if (enemy_blinking){
            // 描画する
            enemyctx.drawImage(enemy, enemyX, enemyY, enemyWidth, enemyHeight);            
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


    // function keydown(){
    //     document.addEventListener("keydown", function(e){
    //     console.log("キーが押されました。 e.key の値:", e.key);
    //     if(e.code === "Digit1"){
    //         console.log("igit1が押されました");
    //     }
    //     if(e.code === "Space"){
    //         console.log("敵が攻撃を発射");
    //         player_attack();
    //     }
    // })
    // }

    //攻撃の実装
    function enemy_attack(){
        //プレイヤーが死んだ後に攻撃を発射しない
        if(!attackloop)return;

        // 球の形
        const attack = document.createElement("img");
        
        //画像の取得
        attack.src = "../assets/images/enemy_attack.png";
        
        attack.className = "enemy_bullet";
        attack.style.position = "absolute";

        const bulletWidthHalf = 15; 

        // 3. 弾の位置を計算
        //    (キャンバスの左 + キャンバス内の敵X + 敵の幅の半分 - 弾の幅の半分)
        attack.style.left = `${enemyX + (enemyWidth / 2) - bulletWidthHalf}px`;
        //    (キャンバスの上 + キャンバス内の敵Y + 敵の高さ)
        attack.style.top = `${enemyY + (enemyHeight / 2)}px`;

        game_area.appendChild(attack);
        console.log("敵が攻撃を発射");

        const speed = 4;

        //ufo独自の攻撃
        let attack1,attack2; 
        if(typeof ufo != "undefined"){
            //attackをコピー
            attack1 = attack.cloneNode(true);
            attack2 = attack.cloneNode(true);

            game_area.appendChild(attack1);
            game_area.appendChild(attack2);
            console.log("ufo攻撃発射");

            //斜め攻撃
            const  diagonal_move= setInterval(() => {
            if (window.isGamePaused) {
                return; // 一時停止中なら弾を動かさない
            }
            //位置を数値に変更
            const top1 = parseInt(attack1.style.top);
            const left1 = parseInt(attack1.style.left);
            const top2 = parseInt(attack2.style.top);
            const left2 = parseInt(attack2.style.left);

            attack1.style.top = `${top1 + speed}px`;
            attack2.style.top = `${top2 + speed * 2}px`;

            if (top1 > 636 || top2 > 636) {
                clearInterval(diagonal_move);
                attack1.remove();
                attack2.remove()
            }
        }, 16);

        }
        
        const move = setInterval(() => {
            if (window.isGamePaused) {
                return; // 一時停止中なら弾を動かさない
            }
            const currentTop = parseInt(attack.style.top);
            attack.style.top = `${currentTop + speed}px`;

            if (currentTop > 636) {
                clearInterval(move);
                attack.remove();
            }
        }, 16);
    }

    //移動設定
    let enemyLeft = false;
    let enemyRigth = false;

    //乱数生成
    function randomNamber(){
        const r = Math.floor(Math.random() * 3);
        return r;
    }

    // //移動処理
    function randomMove(){
        //弾の移動を停止
        if (window.isGamePaused) {
            return; // 一時停止中なら移動方向を変えない
        }
        //敵の移動を初期化
        enemyLeft = false;
        enemyRigth = false;

        if(move){
            //乱数設定
            const r = randomNamber();
            enemyLeft = r === 1;
            enemyRigth = r === 2;
        }
    }


    //攻撃のランダム生成
    function attack_schedule(){
        const delay = (randomNamber() + 1.5)*400;
        setTimeout(()=>{
            // 一時停止中でない場合のみ、攻撃する
            if (!window.isGamePaused) {
            enemy_attack();
            }
            attack_schedule();
        }, delay);
    }


    // keydown();

    function keydownHandler(e) {
        // 離されたキーの値をチェック
        // ←キーが離されたとき
        if (e.key == 'ArrowLeft'){
            enemyLeft = true;
        }
        // →キーが離されたとき
        else if (e.key == 'ArrowRight'){
            enemyRigth = true;
        }
    }

    function keyupHandler(e) {
        // 離されたキーの値をチェック
        // ←キーが離されたとき
        if (e.key == 'ArrowLeft'){
            enemyLeft = false;
        }
        // →キーが離されたとき
        else if (e.key == 'ArrowRight'){
            enemyRigth = false;
        }
    }

    //描画処理
    window.enemy_start = function (){
        randomMove();
        setInterval(randomMove, 200);

        //3秒後から攻撃開始
        setTimeout(attack_schedule(), 3000);

        // // キーを押したときにtrueにする
        // document.addEventListener('keydown', keydownHandler);
        // // キーを離したときにfalseにする
        // document.addEventListener('keyup', keyupHandler);

    }
    enemydraw();
});