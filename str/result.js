// BGMファイルを読み込む
const bgm = new Audio('../assets/sounds/BGM/result.mp3');

// ループ再生を有効にする
bgm.loop = true;

// 音量を調整（0.0〜1.0）
bgm.volume = 0.5;

// ページ読み込み後に再生
window.addEventListener('load', () => {
  bgm.play().catch(err => {
    console.error("BGM再生エラー:", err);
  });
});

//timeの設定
//クリアタイムの取得
window.ufo_time = parseInt(sessionStorage.getItem("ufo_time"));
window.debris_time = parseInt(sessionStorage.getItem("debris_time"));
window.boss_time = parseInt(sessionStorage.getItem("boss_time"));

const a = isNaN(ufo_time) ? 0 : ufo_time;
const b = isNaN(debris_time) ? 0 : debris_time;
const c = isNaN(boss_time)? 0 : boss_time;
const total = a + b + c;
let houres = Math.floor(total / 360);
let minutes = Math.floor((total % 360) / 60);
let secs = total % 60;
houres = houres < 10 ? `0${houres}` : `${houres}`;
minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
secs = secs < 10 ? `0${secs}` : `${secs}`;

//textboxを取得、上書き
const time_text = document.getElementById("crear_time");
time_text.textContent = `${houres}:${minutes}:${secs}`;

// ボタンを取得
function setupButton(id, url) {
  const btn = document.getElementById(id);
  btn.addEventListener('click', () => {
    const sound = new Audio('../assets/sounds/effects/button.mp3');
    sound.volume = 1.0;
    sound.currentTime = 0;
    sound.play().catch(() => {});
    setTimeout(() => {
      window.location.href = url;
    }, 700);
  });
}

setupButton('Title_button', 'Title.html');

document.addEventListener('DOMContentLoaded', () => {

    // 1. 要素を取得
    const h1Element = document.querySelector('.result-box h1');
    const pElement = document.querySelector('.result-box p');
    
    // 2. URLをチェック
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status'); 

    // 3. メッセージを書き換える
    if (status === 'boss_clear') {
        h1Element.textContent = 'Mission Complete!';
        pElement.textContent = 'おめでとう！次の惑星に到達したぞ！！！';
        
    } else if (status === 'ufo_clear') {
        h1Element.textContent = 'Stage Clear!';
        pElement.textContent = 'UFOを撃破！見つけた惑星に向かおう！';

    } else {
        // デフォルト (h1 は HTMLのままでもOK)
        // h1Element.textContent = 'Congratulations'; 
        
        // p は HTMLのままでもOK
        // pElement.textContent = 'おめでとう！次の惑星に到達したぞ！！！';
    }

    // ★★★ ここを修正 ★★★
    // 4. p タグの書き換えが完了したので、表示する
    if (pElement) {
        pElement.style.visibility = 'visible'; // p を表示
    }
    // (h1 は何もしない)
    // ★★★ 修正ここまで ★★★

    // (タイム表示やボタン処理...)
    
});




/*
<div id="clear-time">タイム: 読み込み中...</div>

<script>
  const params = new URLSearchParams(window.location.search); // URLの ?time=... を解析
  const time = params.get('time'); // time の値を取得

  if (time) {
    document.getElementById('clear_time').textContent = `タイム: ${time}`;
  } else {
    document.getElementById('clear_time').textContent = 'タイム: 不明';
  }
</script>
*/