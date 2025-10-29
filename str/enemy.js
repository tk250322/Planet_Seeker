//描画処理
let move = false;
move = true;

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
// enemy_hit.style.border = "2px dashed lime";
// enemy_hit.style.backgroundColor = "rgba(0, 255, 0, 0.2)";


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
    enemy_hit.style.left = `${enemyX + 52}px`;
    enemy_hit.style.top = `${enemyY + 65}px`;

}


function keydown(){
    document.addEventListener("keydown", function(e){
    console.log("キーが押されました。 e.key の値:", e.key);
    if(e.code === "Digit1"){
        console.log("igit1が押されました");
    }
    if(e.code === "Space"){
        console.log("敵が攻撃を発射");
        player_attack();
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
    attack.style.top = `${canvasRect.top + enemyY + (enemyHeight / 2)}px`;

    document.body.appendChild(attack);
    console.log("敵が攻撃を発射");
    
    const speed = 4;
    const move = setInterval(() => {
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
    //敵の移動を初期化
    enemyLeft = false;
    enemyRigth = false;

    //乱数設定
    const r = randomNamber();
    enemyLeft = r === 1;
    enemyRigth = r === 2;
}


//攻撃のランダム生成
function attack_schedule(){
    const delay = (randomNamber() + 1.5)*400;
    setTimeout(()=>{
        enemy_attack();
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

if(move){
    enemydraw();

    randomMove();
    setInterval(randomMove, 200);

    //3秒後から攻撃開始
    setTimeout(attack_schedule(), 3000);

    // キーを押したときにtrueにする
    document.addEventListener('keydown', keydownHandler);
    // キーを離したときにfalseにする
    document.addEventListener('keyup', keyupHandler);
}