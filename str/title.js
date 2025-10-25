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
const button = document.getElementById('save_button');

button.addEventListener('click', () => {
  const decisionSound = new Audio('../assets/sounds/effects/button.mp3');
  decisionSound.volume = 1.0;
  decisionSound.currentTime = 0;

  // 再生が成功したら遷移
  decisionSound.play().then(() => {
    setTimeout(() => {
      window.location.href = 'game_area.html';
    }, 700); 
  }).catch(err => {
    // 音が鳴らなくても遷移は続行
    window.location.href = 'game_area.html';
  });
});