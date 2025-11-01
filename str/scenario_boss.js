window.attackloop = true;

// 1. メッセージ配列
const messages = [
  { speaker: "girl", name: "女の子", text: "いい縁側ですね 気に入りました" },
  { speaker: "boy",  name: "男の子", text: "そうだろう 僕のお気に入りなんだ" },
  { speaker: "girl", name: "女の子", text: "ここでお茶でも飲みたいですね" },
];

// 2. グローバル変数
let currentMessageIndex = 0;
let isRevealing = false;
let gameHasStarted = false; // ゲームの二重起動を防ぐフラグ

// 3. アイコンを切り替える関数
function updateCharacterIcon(speaker) {
  const allIcons = document.querySelectorAll("#textbox .character_icon");
  allIcons.forEach(icon => {
    icon.classList.remove("active");
  });
  const activeIcon = document.querySelector("#textbox #icon_" + speaker);
  if (activeIcon) {
    activeIcon.classList.add("active");
  }
}

// 4. 名前ボックスを更新する関数
function updateSpeakerName(name) {
  const nameBox = document.querySelector("#textbox #name-box");
  const nameP = document.querySelector("#textbox #speaker-name-p");

  if (!nameBox || !nameP) {
    if (!gameHasStarted) {
        console.warn("警告: #name-box または #speaker-name-p が見つかりません。");
    }
    return;
  }

  if (name) {
    nameP.textContent = name;
    nameBox.style.display = "block";
  } else {
    nameP.textContent = "";
    nameBox.style.display = "none";
  }
}

// 5. テキスト表示を開始するメイン関数
function initRevealTextMessage(message) { 
  updateCharacterIcon(message.speaker);
  updateSpeakerName(message.name);

  const text_message_p = document.querySelector("#textbox .text_message_p");

  if (!text_message_p) {
    console.error("エラー: #textbox .text_message_p が見つかりません。");
    return;
  }

  text_message_p.innerHTML = ""; 

  let chars = [];
  if (message.text) {
    message.text.split("").forEach((char) => {
      let span = document.createElement("span");
      span.textContent = char;
      text_message_p.appendChild(span);

      chars.push({
        span,
        delayAfter: char === " " ? 0 : 60,
      });
    });
  }

  isRevealing = true;
  revealTextMessage(chars, () => {
    isRevealing = false;
  });
}

// 6. 1文字ずつ表示する関数 (変更なし)
function revealTextMessage(list, onComplete) {
  const next = list.splice(0, 1)[0];
  if (!next) { 
    onComplete();
    return;
  }
  next.span.classList.add("revealed");

  if (list.length > 0) {
    setTimeout(() => {
      revealTextMessage(list, onComplete);
    }, next.delayAfter);
  } else {
    onComplete();
  }
}

// 7. イベントリスナー

// (DOMContentLoadedイベントは変更なし)
window.addEventListener("DOMContentLoaded", () => {
  if (messages.length > 0) {
    initRevealTextMessage(messages[currentMessageIndex]);
  }
});

// ▼▼▼ ここを修正しました (処理の順番を変更) ▼▼▼
window.addEventListener("click", () => {
  // 表示中か、ゲームが始まっていたら何もしない
  if (isRevealing || gameHasStarted) return;

  currentMessageIndex++;

  if (currentMessageIndex < messages.length) {
    initRevealTextMessage(messages[currentMessageIndex]);
  }

  // 最後のメッセージが終わり、まだゲームが始まっていない場合
  if (currentMessageIndex === messages.length && !gameHasStarted) {
    
    // すぐにフラグを立てて二重起動を防ぐ
    gameHasStarted = true;

    // (A) ★すぐに★ メッセージボックスやアイコンを消す
    updateCharacterIcon(null);
    updateSpeakerName(null);
    const textbox = document.getElementById("textbox");
    if (textbox) {
      textbox.style.display ="none";
    }

    // (B) ★すぐに★ 「スタート」のアニメーションを開始 (CSSで2秒に設定)
    const startDisplay = document.getElementById("start-display");
    if (startDisplay) {
      startDisplay.classList.add("show");
    }

    // (C) 1.5秒後 (アニメーションの終了と同時) にゲームを開始
    setTimeout(() => {
      
      // (D) ゲームを開始する
        enemy_start();
        player_start();
        hit_start();
        timer_start();
        
    }, 1500); // ← JSの待機時間 (CSSのアニメーションと同期)
  }
});