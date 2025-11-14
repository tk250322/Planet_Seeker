// BGMファイルを読み込む
const bgm = new Audio('../assets/sounds/BGM/title.mp3');

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

// ボタンを取得
function setupButton(id, url) {
  const btn = document.getElementById(id);
  btn.addEventListener('click', () => {
    const sound = new Audio('../assets/sounds/effects/button.mp3');
    sound.volume = 0.5;
    sound.currentTime = 0;
    sound.play().catch(() => {});
    setTimeout(() => {
      window.location.href = url;
    }, 700);
  });
}

setupButton('debris_button', 'debris.html');
setupButton('UFO_button', 'UFO.html');
setupButton('save_button', 'game_area.html');