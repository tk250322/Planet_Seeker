window.attackloop = true;

// 1. メッセージ配列
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

// 2. グローバル変数
let currentMessageIndex = 0;
let isRevealing = false;
let gameHasStarted = false; // ゲームの二重起動を防ぐフラグ

// ▼▼▼ オーディオ要素をAudioオブジェクトとして直接生成 ▼▼▼
// ※パスはご自身の環境に合わせて修正してください
const bgmNovel = new Audio('../assets/sounds/BGM/boss_textbgm.mp3');
const bgmGame = new Audio('../assets/sounds/BGM/boss.mp3');
const seClick = new Audio('../assets/sounds/effects/text_se.mp3');

// BGM/SEの初期設定 (音量調整)
bgmNovel.volume = 0.7;
bgmGame.volume = 0.7;
seClick.volume = 0.3;
// ▼▼▼ メッセージ送りSEをループ再生に設定 ▼▼▼
seClick.loop = true;

let isNovelBgmPlaying = false; // 会話BGMの再生状態を管理するフラグ

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
  
  // ▼▼▼ [SE] テキスト表示完了時にSEを停止するコールバック ▼▼▼
  revealTextMessage(chars, () => {
    isRevealing = false;
    
    // テキスト表示が完了したらSEを停止
    if (seClick) {
      seClick.pause();
      seClick.currentTime = 0; // 再生位置をリセット
    }
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

// (DOMContentLoadedイベント)
window.addEventListener("DOMContentLoaded", () => {

  if (messages.length > 0) {
    initRevealTextMessage(messages[currentMessageIndex]);
  }

  // ブラウザの自動再生ポリシーにより、ユーザーがページを操作（クリックなど）
  // するまで音声は再生できません。
  // 最初のクリックイベントでBGM再生を開始します。
});


window.addEventListener("click", () => {
  // 表示中か、ゲームが始まっていたら何もしない
  if (isRevealing || gameHasStarted) return;

  // ▼▼▼ [BGM] 最初のクリックで会話BGMを開始 ▼▼▼
  // (ブラウザの自動再生ポリシー対策)
  if (!isNovelBgmPlaying && bgmNovel) {
    // play()はPromiseを返すため、catchでエラー処理を行うことが推奨されます
    bgmNovel.play().catch(e => {});
    isNovelBgmPlaying = true;
  }

  currentMessageIndex++;

  // -----------------------------------------------
  // 1. 次のメッセージがある場合
  // -----------------------------------------------
  if (currentMessageIndex < messages.length) {
    // ▼▼▼ [SE] メッセージ送り効果音 (ループ開始) ▼▼▼
    if (seClick) {
      seClick.currentTime = 0; // 毎回、SEを最初から再生
      seClick.play().catch(e => {}); // ループ再生が開始される
    }
    // 次のメッセージを表示
    initRevealTextMessage(messages[currentMessageIndex]);
  }

  // -----------------------------------------------
  // 2. 最後のメッセージが終わり、ゲームがまだ始まっていない場合
  // -----------------------------------------------
  if (currentMessageIndex === messages.length && !gameHasStarted) {
    
    // ▼▼▼ [SE] (念のため) SEが停止していることを確認 ▼▼▼
    if (seClick) {
        seClick.pause();
        seClick.currentTime = 0;
    }

    // すぐにフラグを立てて二重起動を防ぐ
    gameHasStarted = true;

    // ▼▼▼ [BGM] BGMの切り替え ▼▼▼
    if (bgmNovel) {
      bgmNovel.pause(); // 会話BGMを停止
      bgmNovel.currentTime = 0; // 再生位置を最初に戻す
    }
    if (bgmGame) {
      bgmGame.play().catch(e => {}); // ゲームBGMを開始
    }

    // (A) メッセージボックスやアイコンを消す
    updateCharacterIcon(null);
    updateSpeakerName(null);
    const textbox = document.getElementById("textbox");
    if (textbox) {
      textbox.style.display ="none";
    }

    // (B) 「スタート」のアニメーションを開始
    const startDisplay = document.getElementById("start-display");
    if (startDisplay) {
      startDisplay.classList.add("show");
    }

    // (C) 1.5秒後 (CSSのアニメーション時間と同期) にゲームを開始
    setTimeout(() => {
      
      // (D) ゲームのメイン処理を開始する
      
      enemy_start();
      player_start();
      hit_start();
      timer_start();
        
    }, 1500); 
  }
});

