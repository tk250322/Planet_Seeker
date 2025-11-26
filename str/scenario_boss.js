// --- グローバル変数 ---
window.isGamePaused = false; // ゲームが一時停止中か
window.currentMessageIndex = 0; // 現在のメッセージ番号
let isRevealing = false; // テキスト表示中か
window.gameHasStarted = false; // ゲーム本編が開始したか
let isNovelBgmPlaying = false; // 会話BGMが再生中か
let ismenuling = false; // (未使用のフラグ)

// --- オーディオ要素 ---
const bgmNovel = new Audio('../assets/sounds/BGM/boss_scenario.mp3');
window.bgmGame = new Audio('../assets/sounds/BGM/boss_bgm.mp3');
const seClick = new Audio('../assets/sounds/effects/text_se.mp3');
const menuClick = new Audio('../assets/sounds/effects/menu.mp3');

// BGM/SEの初期設定
bgmNovel.volume = 0.5;
bgmGame.volume = 0.7;
seClick.volume = 0.3;
menuClick.volume = 0.5; // 音量を0.5に設定
seClick.loop = true; // 会話中はループ再生
bgmNovel.loop = true;
bgmGame.loop = true;

// --- メッセージ配列 ---
const messages = [
  { speaker: "null", name: null, text: "とうとう惑星の目の前に到着した。" },
  { speaker: "boss", name: "エクゾクォア", text: "よく来たな。遠き星に住む生物よ。我はエクゾクォア、「外宇宙の審問官」である。" },
  { speaker: "boss", name: "エクゾクォア", text: "名乗るがいい、ここがお前の墓場となる。" },
  { speaker: "main",  name: "ルミナス・ノア", text: "俺の名は、ルミナス・ノア。星の命を、光で繋ぐ者、Planet Seekerだ。" },
  { speaker: "boss", name: "エクゾクォア", text: "いい名だ。だが、お前たちの旅路はここで終わる。" },
  { speaker: "main",  name: "ルミナス・ノア", text: "お前、もしかして俺たちの星を攻撃してきたやつじゃないのか？" },
  { speaker: "boss2", name: "エクゾクォア", text: "よく気が付いたな。ここまで来ただけはある。だが、ここまでだ。" },
  { speaker: "main2",  name: "ルミナス・ノア", text: "人類のかたき。絶対に倒す！！！" },
];

// 【追加】敵HP 0時用の終了シナリオメッセージ配列
const endMessages = [
  { speaker: "boss", name: "エクゾクォア", text: "まさか、この我を打ち破るとは..." },
  { speaker: "boss", name: "エクゾクォア", text: "遠き星に住む生物よ、お前の力、認めよう。" },
  { speaker: "main",  name: "ルミナス・ノア", text: "これで、人類は救われた！" },
  { speaker: "null", name: null, text: "ボスを撃破した！宇宙に平和が戻った。" },
];

// --- 関数: アイコンを更新 ---
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

// --- 関数: 話者名を更新 ---
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

// --- 関数: メッセージ表示を開始 ---
window.initRevealTextMessage = function(message) { 
  console.log("こんにちは、皆さんお元気ですか");
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

// --- 関数: 1文字ずつ表示 (再帰) ---
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

// ===============================================
// イベントリスナー (DOM読み込み完了時)
// ===============================================
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
      window.isGamePaused = true; // ゲームを一時停止
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
      window.isGamePaused = false; // ゲームを再開
    }); 
  }

  // 4. 「タイトルへ」ボタンの処理
  if (returnButton) {
    returnButton.addEventListener('click', (event) => {
      event.stopPropagation(); 

      // 効果音を再生
      menuClick.currentTime = 0;
      menuClick.play().catch(e => {});

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 400); 
    }); 
  }
  
  // 5. メニュー画面の「背景」クリック処理 (ボタン以外)
  if (menuScreen) {
      menuScreen.addEventListener('click', (event) => {
          // メニュー画面の背景クリックがwindow.clickに伝播しないようにする
          event.stopPropagation();
      }); 
  }

  // 5-2. 「スキップ」ボタンの処理
    const skipButton = document.getElementById('skip_button');
    if (skipButton) {
        skipButton.addEventListener('click', (event) => {
            // ページ全体のクリックイベント(会話送り)に伝播しないようにする
            event.stopPropagation();
            
            // メニュー効果音を鳴らす (任意)
            menuClick.currentTime = 0;
            menuClick.play().catch(e => {});

            // 上で定義したスキップ専用関数を呼び出す
            skipConversation(); 
        });
    }

  // 6. 最初のメッセージを表示
  if (messages.length > 0) {
    initRevealTextMessage(messages[currentMessageIndex]);
  }
}); // DOMContentLoaded の閉じタグ


// ===============================================
// 会話送り・ゲームスタート処理 (共通関数)
// ※クリックとスペースキーで共通化するため関数として切り出し
// ===============================================

// 現在のメッセージ配列を管理する変数
window.activeMessages = messages;

window.proceedConversation = function() {
  
  // テキスト表示中、ゲーム本編中、メニュー表示中(Pause中)は処理しない
  if (isRevealing || gameHasStarted || isGamePaused) {
    return;
  }

  // ブラウザの自動再生ポリシー対策 (最初のクリックでBGM開始)
  if (!isNovelBgmPlaying && bgmNovel && activeMessages == messages) {
    bgmNovel.play().catch(e => {});
    isNovelBgmPlaying = true;
  }

  currentMessageIndex++; // 次のメッセージへ

  // 1. 次のメッセージがある場合
  if (currentMessageIndex < activeMessages.length) {
    // 会話送りSEを再生
    if (seClick) {
      seClick.currentTime = 0;
      seClick.play().catch(e => {});
    }
    // 次のメッセージを表示
    initRevealTextMessage(activeMessages[currentMessageIndex]);
  }

  // 2. 最後のメッセージが終わった場合 (ゲーム本編の開始)
  if(currentMessageIndex === activeMessages.length){
  if (activeMessages === messages && !gameHasStarted) {
    
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

    const skipButton = document.getElementById('skip_button');
    if (skipButton) {
        skipButton.style.display = 'none';
    }

    // 「スタート」アニメーション表示
    const startDisplay = document.getElementById("start-display");
    if (startDisplay) {
      startDisplay.classList.add("show");
    }

    // アニメーション時間 (1.5秒) 待ってからゲームロジックを開始
    setTimeout(() => {
        window.start = true; 
    }, 1500);  
  }
  if (activeMessages === endMessages) {
    // 共通部分
    if (seClick) {
      seClick.pause();
      seClick.currentTime = 0;
    }
    updateCharacterIcon(null);
    updateSpeakerName(null);
    const textbox = document.getElementById("textbox");
    if (textbox) textbox.style.display = "none";

    const skipButton = document.getElementById("skip_button");
    if (skipButton) skipButton.style.display = "none";

    //爆発させる
    setTimeout(()=>{
      win_player = false;
      enemydownSound.play();
    },500);

    // 勝利後専用部分
    setTimeout(() => {
      bgmWin.play();
      go_result();
    }, 800);
  }
  }
}


// ===============================================
// 会話送り・ゲームスタート用
// (window.clickイベントリスナー)
// ===============================================
// 共通関数を呼び出すように修正
window.addEventListener("click", proceedConversation);


// ===============================================
// スペースキーによる会話送り
// (window.keydownイベントリスナー)
// ===============================================
window.addEventListener("keydown", (event) => {
  // 押されたキーがスペースキーかどうかを判定
  if (event.key === " " || event.code === "Space") {
    
    // スペースキーのデフォルト動作（スクロールなど）を停止
    event.preventDefault(); 
    
    // クリック時と同じ共通処理を実行
    proceedConversation();
  }
});

// ===============================================
// スキップボタン専用の処理
// ===============================================
function skipConversation() {
    // 既にゲームが始まっているか、メニュー表示中(Pause中)は処理しない
    if (gameHasStarted || window.isGamePaused) {
        return;
    }

    // (念のため) 会話送りSEを停止
    if (seClick) {
        seClick.pause();
        seClick.currentTime = 0;
    }
    
    // (もしテキスト表示中だったら) 強制的に停止
    isRevealing = false; 

    gameHasStarted = true; // ゲーム開始フラグを立てる

    // BGM切り替え
    if (isNovelBgmPlaying) {
        bgmNovel.pause();
        bgmNovel.currentTime = 0;
    } else {
        bgmNovel.play().catch(e => {});
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

    // スキップボタン自体も非表示にする
    const skipButton = document.getElementById('skip_button');
    if (skipButton) {
        skipButton.style.display = 'none';
    }

    // 「スタート」アニメーション表示
    const startDisplay = document.getElementById("start-display");
    if (startDisplay) {
        startDisplay.classList.add("show");
    }

    // スキップ時も1.5秒待ってから開始
    setTimeout(() => {
        window.start = true;
    }, 1500);
}


// ===============================================
// 画面リサイズ対応
// ゲームエリアをアスペクト比を維持して中央に配置
// ===============================================

// 実行する関数
function resizeGameArea() {
    const gameArea = document.getElementById('game_play_area');
    if (!gameArea) return; // ゲームエリアがなければ何もしない

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // ゲームエリアの基準サイズ (CSSの width/height と合わせる)
    const baseWidth = 600;
    const baseHeight = 600;

    // 画面下部にメッセージボックス用のスペースを確保（約150pxと仮定）
    // (テキストボックスの高さ 100px + CSSのpadding 20px + 余白)
    const availableHeight = viewportHeight - 150; 

    // 1. 「幅」を基準にした場合の拡大・縮小率
    const scaleX = viewportWidth / baseWidth;
    
    // 2. 「高さ」を基準にした場合の拡大・縮小率
    const scaleY = availableHeight / baseHeight;

    // 3. 幅と高さ、小さい方のスケールを採用 (アスペクト比を維持)
    const scale = Math.min(scaleX, scaleY);

    // 4. CSSの transform を更新
    //    (中央配置の translate(-50%, -50%) と拡大・縮小の scale を両方指定)
    gameArea.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

// 1. ページの読み込み完了時に、一度サイズ調整を実行
window.addEventListener('DOMContentLoaded', resizeGameArea);

// 2. ブラウザのウィンドウサイズが変わるたびに、サイズ調整を実行
window.addEventListener('resize', resizeGameArea);