// BGMファイルを読み込む
const bgm = new Audio('assets/sounds/BGM/title.mp3');

// ループ再生を有効にする
bgm.loop = true;

// 音量を調整（0.0〜1.0）
bgm.volume = 0.5;

// === ファイルスコープで要素変数を宣言 ===
// DOMContentLoadedでこれらの変数にHTML要素が代入されます。
let textBox;
let explanation;
let explanationButton;
let returnButton; // 説明画面とエラー画面で共有
let error_warning;

// BGM再生ロジック（自動再生ポリシーに対応するため関数化）
function attemptPlayBGM() {
    if (!bgm) return;

    bgm.play().catch(err => {
        console.error("BGM再生エラー:", err);
        
        // 要素が取得されているか確認
        if (!textBox || !error_warning || !returnButton) return; 

        // タイトル画面を非表示にする
        textBox.classList.add("hidden");
        textBox.style.display = "none";

        // エラー画面を表示する
        error_warning.classList.remove("hidden");
        error_warning.style.display = "block"; 

        // 戻るボタンの処理 ( エラー -> タイトル)
        const handleCloseError = function() {
            // エラー画面を非表示にする
            error_warning.classList.add("hidden");
            error_warning.style.display = "none";

            // タイトル画面を表示する
            textBox.classList.remove("hidden");
            textBox.style.display = "block";
            
            // ユーザー操作後にBGM再生を再試行
            attemptPlayBGM();
            
            // イベントリスナーを解除して重複を防ぐ
            returnButton.removeEventListener("click", handleCloseError);
        };

        // イベントが重複しないように一度だけ実行
        // returnButtonが他のリスナーと競合しないよう、{ once: true } を使用
        returnButton.addEventListener("click", handleCloseError, { once: true });
    });
}

// ページ読み込み後に再生を試みる
window.addEventListener('load', attemptPlayBGM);

// ボタンを取得し、画面遷移処理を設定する関数
function setupButton(id, url) {
    const btn = document.getElementById(id);
    if (!btn) return;

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
    // === DOMContentLoadedで要素を取得し、ファイルスコープの変数に代入 ===
    textBox = document.querySelector(".text-box");
    explanation = document.getElementById("explanation");
    explanationButton = document.getElementById("explanation_button");
    returnButton = document.getElementById("return_button");
    error_warning = document.getElementById("error_warning"); 

    // 遊び方ボタンの処理 (タイトル -> 説明)
    explanationButton.addEventListener("click", function() {
        // タイトル画面を非表示にする
        textBox.classList.add("hidden");
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
        
        // 説明画面から戻った時にもBGM再生を試みる（ブロックされている場合に対応）
        attemptPlayBGM();
    });
});