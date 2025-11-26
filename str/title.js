// BGMファイルを読み込む
const bgm = new Audio('assets/sounds/BGM/title.mp3');

// ループ再生を有効にする
bgm.loop = true;

// 音量を調整（0.0〜1.0）
bgm.volume = 0.5;

// ページ読み込み後に再生
window.addEventListener('load', () => {
  bgm.play().catch(err => {
    console.error("BGM再生エラー:", err);
    // 1. 表示させたい要素を取得
    const warningElement = document.getElementById("error_warning");

    // タイトル画面を非表示にする
    textBox.classList.add("hidden"); // hiddenクラスがあればCSSで非表示になるはず
    textBox.style.display = "none";

    // エラー画面を表示する
    error_warning.classList.remove("hidden");
    error_warning.style.display = "block"; 

    // 戻るボタンの処理 ( エラー -> タイトル)
    returnButton.addEventListener("click", function() {
        // エラー画面を非表示にする
        error_warning.classList.add("hidden");
        error_warning.style.display = "none";

        // タイトル画面を表示する
        textBox.classList.remove("hidden");
        textBox.style.display = "block";
    });
  });
});

// ボタンを取得
function setupButton(id, url) {
  const btn = document.getElementById(id);
  btn.addEventListener('click', () => {
    const sound = new Audio('assets/sounds/effects/button.mp3');
    sound.volume = 0.5;
    sound.currentTime = 0;
    sound.play().catch(() => {});
    setTimeout(() => {
      window.location.href = url;
    }, 700);
  });
}

setupButton('debris_button', 'HTML/debris.html');
setupButton('UFO_button', 'HTML/UFO.html');
setupButton('save_button', 'HTML/game_area.html');

document.addEventListener("DOMContentLoaded", function() {
  const textBox = document.querySelector(".text-box");
  const explanation = document.getElementById("explanation");
  const explanationButton = document.getElementById("explanation_button");
  const returnButton = document.getElementById("return_button");

  // 遊び方ボタンの処理 (タイトル -> 説明)
  explanationButton.addEventListener("click", function() {
      // タイトル画面を非表示にする
      textBox.classList.add("hidden"); // hiddenクラスがあればCSSで非表示になるはず
      textBox.style.display = "none";

      // 説明画面を表示する
      explanation.classList.remove("hidden");
      explanation.style.display = "block"; 
  });

  // 戻るボタンの処理 (説明 -> タイトル)
  returnButton.addEventListener("click", function() {
      // 説明画面を非表示にする
      explanation.classList.add("hidden");
      explanation.style.display = "none";

      // タイトル画面を表示する
      textBox.classList.remove("hidden");
      textBox.style.display = "block";
  });
})