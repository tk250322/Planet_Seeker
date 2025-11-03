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
    // 備考: ユーザーが最初にページをクリックするまで、再生がブロックされることがあります
  });
});

// ★ 修正点 1: ボタンの効果音を *あらかじめ* 読み込んでおく
const buttonSound = new Audio('../assets/sounds/effects/button.mp3');
buttonSound.volume = 1.0;
buttonSound.preload = 'auto';


// ボタンを取得
function setupButton(id, url) {
  const btn = document.getElementById(id);
  
  if (!btn) {
    console.error(`ID "${id}" のボタンが見つかりません。`);
    return;
  }
  
  // ★ 修正点 5: (event) 引数を削除 (不要になったため)
  btn.addEventListener('click', () => {
    
    // ★ 修正点 6: event.preventDefault() を削除 (不要になったため)

    // ★ 修正点 2: new Audio() をここでは実行しない
    
    // ★ 修正点 3: 再生位置をリセット
    buttonSound.currentTime = 0;
    
    // ★ 修正点 4: エラーをコンソールに出力する
    buttonSound.play().catch(err => {
      console.error("ボタン効果音の再生エラー:", err);
    });
    
    // JavaScriptによる遅延ページ遷移を実行します
    setTimeout(() => {
      window.location.href = url;
    }, 700);
  });
}

setupButton('Title_button', 'Title.html');

