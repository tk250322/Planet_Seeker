// 読みこまれたら実行
document.addEventListener('DOMContentLoaded', function() {
    // 関数keydownHandlerの定義
    function keydownHandler(e) {
        // 押されたキーの値をチェック
        // ↑キーが押されたとき
        if (e.key == 'ArrowUp'){
            player_up = true;
            console.log("player_upがtrueに設定されました");
        }
        // ↓キーが押されたとき
        else if (e.key == 'ArrowDown'){
            player_down = true;
            console.log("player_downがtrueに設定されました");
        }
        // ←キーが押されたとき
        else if (e.key == 'ArrowLeft'){
            player_left = true;
            console.log("player_leftがtrueに設定されました");
        }
        // →キーが押されたとき
        else if (e.key == 'ArrowRight'){
            player_rigth = true;
            console.log("player_rightがtrueに設定されました");
        }
        else if (e.code === "Space" && !attack_timing){
            console.log("spaceが押されました");
            attack_timing = true;
            player_attack();
        }

    }

    // 関数keyupHandlerの定義
    function keyupHandler(e) {
        // 離されたキーの値をチェック
        // ↑キーが離されたとき
        if (e.key == 'ArrowUp'){
            player_up = false;
            console.log("player_upがfalseに設定されました");
        }
        // ↓キーが離されたとき
        else if (e.key == 'ArrowDown'){
            player_down = false;
            console.log("player_downがfalseに設定されました");
        }
        // ←キーが離されたとき
        else if (e.key == 'ArrowLeft'){
            player_left = false;
            console.log("player_leftがfalseに設定されました");
        }
        // →キーが離されたとき
        else if (e.key == 'ArrowRight'){
            player_rigth = false;
            console.log("player_rightがfalseに設定されました");
        }
        else if (e.code === "Space"){
            attack_timing = false;
        }
    }

    //関数updateを定義 
    function update() {
        // 上へ動かす条件
        if (player_up && Y > 0){
            Y -= speedY;
        }
        // 下へ動かす条件
        if (player_down && Y + Height < canvas.height){
            Y += speedY;
        }
        // 左へ動かす条件
        if (player_left && X > 0){
            X -= speedX;
        }
        // 右へ動かす条件
        if (player_rigth && X + Width < canvas.width){
            X += speedX;
        }
    }

    // canvasに描画してアニメーションする
    function draw() {
        // キャンバスをクリアにする
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 描画位置を更新する
        update();

        // 描画する
        ctx.drawImage(playerImage, X, Y, Width, Height);

        // 繰り返してアニメーションする
        requestAnimationFrame(draw);
    }

    // playercanvasのid取得と描画ツールの取得
    const canvas = document.getElementById('playercanvas');
    const ctx = canvas.getContext('2d');
    
    //キャラのidを取得
    const playerImage = document.getElementById('player');

    // キャラの幅と高さ
    const Width = 100;
    const Height = 100;

    // キャラの初期位置設定
    let X = canvas.width / 2 - 50;
    let Y = canvas.height - 150;    
    
    // キャラの移動速度設定
    let speedX = 2;
    let speedY = 1;
    
    // キーが押されているか(trueかfalse)
    let player_up = false;
    let player_down = false;
    let player_left = false;
    let player_rigth = false;

    // キーを押したときにtrueにする
    document.addEventListener('keydown', keydownHandler);
    // キーを離したときにfalseにする
    document.addEventListener('keyup', keyupHandler);
    // アニメーション開始
    draw();
let attack_timing = false;
function player_attack(){
    // 球の形
    const attack = document.createElement("img");
    
    //画像の取得
    attack.src = "../assets/images/player_attack.png";
    
    attack.className = "enemy_bullet";
    attack.style.position = "absolute";

    
    // 1. 画面に対する「キャンバス」の位置を取得
    const canvasRect = canvas.getBoundingClientRect();

    const bulletWidthHalf = 15; 

    // 3. 弾の位置を計算
    //    (キャンバスの左 + キャンバス内のplayerX + playerの幅の半分 - 弾の幅の半分)
    attack.style.left = `${canvasRect.left + X + (Width / 2) - bulletWidthHalf}px`;
    //    (キャンバスの上 + キャンバス内のplayerY + playerの高さ)
    attack.style.top = `${canvasRect.top + Y + 20}px`;

    document.body.appendChild(attack);
    console.log("攻撃を発射");
    
    const speed = 4;
    const move = setInterval(() => {
        const currentTop = parseInt(attack.style.top);
        attack.style.top = `${currentTop - speed}px`;

        if (currentTop < 60) {
            clearInterval(move);
            attack.remove();
        }
    }, 16);
}
});