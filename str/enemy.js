document.addEventListener("DOMContentLoaded",function(){
    console.log("enemy.js読み込み済み");
    const enemycanvas = document.getElementById('enemycanvas');
    const enemyctx = enemycanvas.getContext('2d');

    //敵のidを取得
    const enemy = document.getElementById("enemy");

    // 敵の幅と高さ
    const enemyWidth = 60;
    const enemyHeight = 60;

    // 敵の初期位置設定
    let enemyX = enemycanvas.width / 2 - 60;
    let enemyY = 0;    

    // 敵の移動速度設定
    let enemyspeedX = 1;

    function enemydraw() {
        // キャンバスをクリアにする
        enemyctx.clearRect(0, 0, enemycanvas.width, enemycanvas.height);

        // 描画位置を更新する
        update();

        // 描画する
        enemyctx.drawImage(enemy, enemyX, enemyY, enemyWidth, enemyHeight);

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
    }


    function keydown(){
        document.addEventListener("keydown", function(e){
        // console.log("キーが押されました。 e.key の値:", e.key);
        if(e.code === "Space"){
            console.log("spaseが押されました");
            enemy_attack();
        }
    })
    }

    //攻撃の実装
    function enemy_attack(){
        // 球の形
        const attack = document.createElement("img");
        
        //画像の取得
        attack.src = "../assets/images/enemy_attack.png";
        
        attack.className = "enemy_bullet";
        attack.style.position = "absolute";

        
        // 1. 画面に対する「キャンバス」の位置を取得
        const canvasRect = enemycanvas.getBoundingClientRect();

        const bulletWidthHalf = 15; 

        // 3. 弾の位置を計算
        //    (キャンバスの左 + キャンバス内の敵X + 敵の幅の半分 - 弾の幅の半分)
        attack.style.left = `${canvasRect.left + enemyX + (enemyWidth / 2) - bulletWidthHalf}px`;
        //    (キャンバスの上 + キャンバス内の敵Y + 敵の高さ)
        attack.style.top = `${canvasRect.top + enemyY + enemyHeight}px`;

        document.body.appendChild(attack);
        console.log("敵が攻撃を発射");
        
        const speed = 4;
        const move = setInterval(() => {
            const currentTop = parseInt(attack.style.top);
            attack.style.top = `${currentTop + speed}px`;

            if (currentTop > window.innerHeight) {
                clearInterval(move);
                attack.remove();
            }
        }, 16);
    }

    //移動設定
    let enemyLeft = false;
    let enemyRigth = false;

    enemydraw();
    keydown();

    //移動処理
    function randomMove(){
        //敵の移動を初期化
        enemyLeft = false;
        enemyRigth = false;

        //乱数設定
        const r = Math.floor(Math.random() * 3);
        enemyLeft = r === 1;
        enemyRigth = r === 2;
    }
    randomMove();
    setInterval(randomMove, 200);
});