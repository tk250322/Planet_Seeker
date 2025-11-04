/* --- グローバル変数 --- */
window.attackloop = true; // (未使用ですが残します)
let isGamePaused = false;
let currentMessageIndex = 0;
let isRevealing = false;
let gameHasStarted = false;
let isNovelBgmPlaying = false;

/* --- オーディオ要素 --- */
const bgmNovel = new Audio('../assets/sounds/BGM/boss_textbgm.mp3');
const bgmGame = new Audio('../assets/sounds/BGM/boss.mp3');
const seClick = new Audio('../assets/sounds/effects/text_se.mp3');

// BGM/SEの初期設定
bgmNovel.volume = 0.7;
bgmGame.volume = 0.7;
seClick.volume = 0.3;
seClick.loop = true; // テキスト表示中のSEとしてループ設定

/* --- メッセージ配列 --- */
const messages = [
  { speaker: "null", name: null, text: "とうとう惑星の目の前に到着した。" },
  { speaker: "boss", name: "エクゾクォア", text: "よく来たな。遠き星に住む生物よ。我はエクゾクォア、「外宇宙の審問官」である。" },
  { speaker: "boss", name: "エクゾクォア", text: "名乗るがいい、ここがお前の墓場となる。" },
  { speaker: "main",  name: "ルミナス：ノア", text: "俺の名は、ルミナス・ノア。星の命を、光で繋ぐ者、Planet Seekerだ。" },
  { speaker: "boss", name: "エクゾクォア", text: "いい名だ。だが、お前たちの旅路はここで終わる。" },
  { speaker: "main",  name: "ルミナス：ノア", text: "お前、もしかして俺たちの星を攻撃してきたやつじゃないのか？" },
  { speaker: "boss", name: "エクゾクォア", text: "よく気が付いたな。ここまで来ただけはある。だが、ここまでだ。" },
  { speaker: "main",  name: "ルミナス：ノア", text: "人類のかたき。絶対に倒す！！！" },
];

/* --- 関数 (変更なし) --- */
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
function updateSpeakerName(name) {
  const nameBox = document.querySelector("#textbox #name-box");
  const nameP = document.querySelector("#textbox #speaker-name-p");
  if (!nameBox || !nameP) return;
  if (name) {
    nameP.textContent = name;
    nameBox.style.display = "block";
  } else {
    nameP.textContent = "";
    nameBox.style.display = "none";
  }
}
function initRevealTextMessage(message) { 
  updateCharacterIcon(message.speaker);
  updateSpeakerName(message.name);
  const text_message_p = document.querySelector("#textbox .text_message_p");
  if (!text_message_p) return;
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
    if (seClick) {
      seClick.pause();
      seClick.currentTime = 0;
    }
  });
}
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

/* * ===============================================
 * イベントリスナー (DOM読み込み完了時)
 * ★★★ 2つあったDOMContentLoadedを1つに統合 ★★★
 * ===============================================
 */
window.addEventListener('DOMContentLoaded', () => {

  // 1. メニュー関連の要素を取得
  const menuButton = document.getElementById('menu_button');
  const menuScreen = document.getElementById('menu_screen');
  const continueButton = document.getElementById('continue_button');
  const returnButton = document.getElementById('return_button');

  // 2. 「メニュー」ボタンの処理
  if (menuButton) {
    menuButton.addEventListener('click', (event) => {
      // ★★★ 修正点1: イベントの伝播を停止 ★★★
      // (これが無いと、後ろのwindow.clickも発動してしまう)
      event.stopPropagation(); 
      
      menuScreen.style.display = 'block';
      isGamePaused = true;
    });
  }

  // 3. 「続ける」ボタンの処理
  if (continueButton) {
    continueButton.addEventListener('click', (event) => {
      // ★★★ 修正点1: イベントの伝播を停止 ★★★
      event.stopPropagation(); 
      
      menuScreen.style.display = 'none';
      isGamePaused = false;
    });
  }

  // 4. 「タイトルへ」ボタンの処理
  if (returnButton) {
    returnButton.addEventListener('click', (event) => {
      // ★★★ 修正点1: イベントの伝播を停止 ★★★
      event.stopPropagation(); 
      
      window.location.href = 'Title.html'; 
    });
  }
  
  // 5. メニュー画面の「背景」クリック処理
  // (メニューのボタン以外の部分をクリックしても伝播を止める)
  if (menuScreen) {
      menuScreen.addEventListener('click', (event) => {
          event.stopPropagation();
      });
  }

  // 6. (統合) 最初のメッセージを表示
  if (messages.length > 0) {
    initRevealTextMessage(messages[currentMessageIndex]);
  }
});


/* * ===============================================
 * 会話送り・ゲームスタート用
 * (window.clickイベントリスナー)
 * ===============================================
 */
window.addEventListener("click", () => {

  // ★★★ 修正点2: 一時停止中は何もしない ★★★
  if (isRevealing || gameHasStarted || isGamePaused) {
    return;
  }

  // (BGM自動再生ポリシー対策)
  if (!isNovelBgmPlaying && bgmNovel) {
    bgmNovel.play().catch(e => {});
    isNovelBgmPlaying = true;
  }

  currentMessageIndex++;

  // 1. 次のメッセージがある場合
  if (currentMessageIndex < messages.length) {
    if (seClick) {
      seClick.currentTime = 0;
      seClick.play().catch(e => {});
    }
    initRevealTextMessage(messages[currentMessageIndex]);
  }

  // 2. 最後のメッセージが終わった場合
  if (currentMessageIndex === messages.length && !gameHasStarted) {
    
    if (seClick) {
      seClick.pause();
      seClick.currentTime = 0;
    }
    gameHasStarted = true;

    // BGM切り替え
    if (bgmNovel) {
      bgmNovel.pause();
      bgmNovel.currentTime = 0;
    }
    if (bgmGame) {
      bgmGame.play().catch(e => {});
    }

    // UI非表示
    updateCharacterIcon(null);
    updateSpeakerName(null);
    const textbox = document.getElementById("textbox");
    if (textbox) {
      textbox.style.display ="none";
    }

    // スタートアニメーション
    const startDisplay = document.getElementById("start-display");
    if (startDisplay) {
      startDisplay.classList.add("show");
    }

    // ゲームロジックの開始
    setTimeout(() => {
      enemy_start();
      player_start();
      hit_start();
      timer_start();
    }, 1500); // 1.5秒後
  }
});