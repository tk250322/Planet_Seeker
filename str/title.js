// BGMファイルを読み込む
const bgm = new Audio('../assets/sounds/BGM/title.mp3');

// ループ再生を有効にする
bgm.loop = true;

// 音量を調整（0.0〜1.0）
bgm.volume = 0.5;

// ページ読み込み後に再生
window.addEventListener('pageshow', () => {
  bgm.play().catch(err => {
  });
});

const debris_button = document.getElementById('debris_button');
const UFO_button = document.getElementById('UFO_button');
const boss_button = document.getElementById('save_button');
// ボタンを取得
// debris ボタン
debris_button.addEventListener('click', () => {
  const decisionSound = new Audio('../assets/sounds/effects/button.mp3');
  decisionSound.volume = 1.0;
  decisionSound.currentTime = 0;
  decisionSound.play().catch(() => {});
  setTimeout(() => {
    window.location.href = 'debris.html';
  }, 700);
});

// UFO ボタン
UFO_button.addEventListener('click', () => {
  const decisionSound = new Audio('../assets/sounds/effects/button.mp3');
  decisionSound.volume = 1.0;
  decisionSound.currentTime = 0;
  decisionSound.play().catch(() => {});
  setTimeout(() => {
    window.location.href = 'UFO.html';
  }, 700);
});

// boss（スタート）ボタン
boss_button.addEventListener('click', () => {
  const decisionSound = new Audio('../assets/sounds/effects/button.mp3');
  decisionSound.volume = 1.0;
  decisionSound.currentTime = 0;
  decisionSound.play().catch(() => {});
  setTimeout(() => {
    window.location.href = 'game_area.html';
  }, 700);
});