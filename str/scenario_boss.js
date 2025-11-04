/* --- グローバル変数 --- */
window.attackloop = true; 
let isGamePaused = false; // ゲームが一時停止中か
let currentMessageIndex = 0; // 現在のメッセージ番号
let isRevealing = false; // テキスト表示中か
let gameHasStarted = false; // ゲーム本編が開始したか
let isNovelBgmPlaying = false; // 会話BGMが再生中か
let ismenuling = false; // (未使用のフラグ)

/* --- オーディオ要素 --- */
const bgmNovel = new Audio('../assets/sounds/BGM/boss_textbgm.mp3');
const bgmGame = new Audio('../assets/sounds/BGM/boss.mp3');
const seClick = new Audio('../assets/sounds/effects/text_se.mp3');
const menuClick = new Audio('../assets/sounds/effects/menu.mp3');

// BGM/SEの初期設定
bgmNovel.volume = 0.7;
bgmGame.volume = 0.7;
seClick.volume = 0.3;
menuClick.volume = 0.5; // 音量を0.5に設定
seClick.loop = true; // 会話中はループ再生

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

/* --- 関数: アイコンを更新 --- */
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
/* --- 関数: 話者名を更新 --- */
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
/* --- 関数: メッセージ表示を開始 --- */
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
    // 表示完了したら会話SEを停止
    if (seClick) {
      seClick.pause();
      seClick.currentTime = 0;
    }
  });
}
/* --- 関数: 1文字ずつ表示 (再帰) --- */
function revealTextMessage(list, onComplete) {
  const next = list.splice(0, 1)[0];
  if (!next) { 
    onComplete(); // リストが空になったら完了コールバックを呼ぶ
    return;
  }
  next.span.classList.add("revealed");

  if (list.length > 0) {
    setTimeout(() => {
      revealTextMessage(list, onComplete);
    }, next.delayAfter);
  } else {
    onComplete(); // 最後の文字を表示したら完了
  }
}

/* * ===============================================
 * イベントリスナー (DOM読み込み完了時)
 * ===============================================
 */
window.addEventListener('DOMContentLoaded', () => {

  // 1. メニュー関連のHTML要素を取得
  const menuButton = document.getElementById('menu_button');
  const menuScreen = document.getElementById('menu_screen');
  const continueButton = document.getElementById('continue_button');
  const returnButton = document.getElementById('return_button');

  // 2. 「メニュー」ボタンの処理
  if (menuButton) {
    menuButton.addEventListener('click', (event) => {
      event.stopPropagation(); // window.clickへの伝播を停止
      
      // メニュー効果音を再生
      menuClick.currentTime = 0;
      menuClick.play().catch(e => {});

      menuScreen.style.display = 'block'; // メニューを表示
      isGamePaused = true; // ゲームを一時停止
    });
  }

  // 3. 「続ける」ボタンの処理
  if (continueButton) {
    continueButton.addEventListener('click', (event) => {
      event.stopPropagation(); // window.clickへの伝播を停止
      
      // メニュー効果音を再生
      menuClick.currentTime = 0;
      menuClick.play().catch(e => {});

      menuScreen.style.display = 'none'; // メニューを非表示
      isGamePaused = false; // ゲームを再開
    }); 
  }

  // 4. 「タイトルへ」ボタンの処理
  if (returnButton) {
    returnButton.addEventListener('click', (event) => {
      event.stopPropagation(); // window.clickへの伝播を停止
      
      // ★修正★
      // 1. 効果音が鳴り終わったら画面遷移する、というイベントを登録
      menuClick.addEventListener('ended', () => {
        window.location.href = 'Title.html';
      }, { once: true }); // 一回だけ実行する

      // 2. 効果音を再生 (2回再生していたのを1回に修正)
      menuClick.currentTime = 0;
      menuClick.play().catch(e => {});
    }); 
  }
  
  // 5. メニュー画面の「背景」クリック処理 (ボタン以外)
  if (menuScreen) {
      menuScreen.addEventListener('click', (event) => {
          // メニュー画面の背景クリックがwindow.clickに伝播しないようにする
          event.stopPropagation();
      }); 
  }

  // 6. 最初のメッセージを表示
  if (messages.length > 0) {
    initRevealTextMessage(messages[currentMessageIndex]);
  }
}); // DOMContentLoaded の閉じタグ


/* * ===============================================
 * 会話送り・ゲームスタート用
 * (window.clickイベントリスナー)
 * ===============================================
 */
window.addEventListener("click", () => {

  // テキスト表示中、ゲーム本編中、メニュー表示中(Pause中)は処理しない
  if (isRevealing || gameHasStarted || isGamePaused) {
    return;
  }

  // ブラウザの自動再生ポリシー対策 (最初のクリックでBGM開始)
  if (!isNovelBgmPlaying && bgmNovel) {
    bgmNovel.play().catch(e => {});
    isNovelBgmPlaying = true;
  }

  currentMessageIndex++; // 次のメッセージへ

  // 1. 次のメッセージがある場合
  if (currentMessageIndex < messages.length) {
    // 会話送りSEを再生
    if (seClick) {
      seClick.currentTime = 0;
      seClick.play().catch(e => {});
    }
    // 次のメッセージを表示
    initRevealTextMessage(messages[currentMessageIndex]);
  }

  // 2. 最後のメッセージが終わった場合 (ゲーム本編の開始)
  if (currentMessageIndex === messages.length && !gameHasStarted) {
    
    // (念のため) 会話送りSEを停止
    if (seClick) {
      seClick.pause();
      seClick.currentTime = 0;
    }
    gameHasStarted = true; // ゲーム開始フラグを立てる

    // BGM切り替え
    if (bgmNovel) {
      bgmNovel.pause();
      bgmNovel.currentTime = 0;
    }
    if (bgmGame) {
      bgmGame.play().catch(e => {});
    }

    // UI非表示 (メッセージボックスなど)
    updateCharacterIcon(null);
    updateSpeakerName(null);
    const textbox = document.getElementById("textbox");
    if (textbox) {
      textbox.style.display ="none";
    }

    // 「スタート」アニメーション表示
    const startDisplay = document.getElementById("start-display");
    if (startDisplay) {
      startDisplay.classList.add("show");
    }

    // アニメーション時間 (1.5秒) 待ってからゲームロジックを開始
    setTimeout(() => {
      enemy_start();
      player_start();
      hit_start();
      timer_start();
    }, 1500); 
  }
});