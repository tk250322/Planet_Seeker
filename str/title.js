// BGMファイルを読み込む
const bgm = new Audio('assets/sounds/BGM/title.mp3');
bgm.loop = true;
bgm.volume = 0.5;

// === ファイルスコープで要素変数を定義 ===
let textBox;
let explanation;
let explanationButton;
let returnButton;
let error_warning;

// BGM再生ロジック
function attemptPlayBGM() {
    if (!bgm) return; // 定義チェック

    bgm.play().catch(err => {
        console.error("BGM再生エラー:", err);
        
        // 要素が取得されていない場合は処理しない
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
            
            // リスナーを解除 (returnButtonは他の処理でも使うため、重複を防ぐ)
            returnButton.removeEventListener("click", handleCloseError);
        };

        // イベントが重複しないように一度だけ実行
        returnButton.addEventListener("click", handleCloseError, { once: true });
    });
}

// ページ読み込み後に再生を試みる
window.addEventListener('load', attemptPlayBGM);

// ボタンを取得
function setupButton(id, url) {
    const btn = document.getElementById(id);
    if (!btn) return; // ボタンが存在しない場合は処理しない

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
        
        attemptPlayBGM();
    });
});