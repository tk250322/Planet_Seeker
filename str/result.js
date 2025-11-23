document.addEventListener('DOMContentLoaded', () => {
    //クリアタイムの取得
    window.ufo_time = parseInt(sessionStorage.getItem("ufo_time"));
    window.debris_time = parseInt(sessionStorage.getItem("debris_time"));
    window.boss_time = parseInt(sessionStorage.getItem("boss_time"));
    let time = 0;

    // 1. 要素を取得
    const h1Element = document.querySelector('.result-box h1');
    const pElement = document.querySelector('.result-box p');
    
    // 2. URLをチェック
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status'); 

    // 3. メッセージを書き換える
    if (status === 'boss_clear') {
        h1Element.textContent = 'Mission Complete!';
        pElement.textContent = 'おめでとう！次の惑星に到達したぞ！！！';
        time = boss_time;

    } else if (status === 'ufo_clear') {
        h1Element.textContent = 'Stage Clear!';
        pElement.textContent = 'UFOを撃破！見つけた惑星に向かおう！';
        time = ufo_time;

    } else {
        // デフォルト (h1 は HTMLのままでもOK)
        // h1Element.textContent = 'Congratulations'; 
        
        // p は HTMLのままでもOK
        // pElement.textContent = 'おめでとう！次の惑星に到達したぞ！！！';

        //スコアを表示
        const final_scole = sessionStorage.getItem("debris_score");
        document.getElementById("small_title").textContent = "スコア";
        document.getElementById("crear_time").textContent = final_scole;
    }

    // ★★★ ここを修正 ★★★
    // 4. p タグの書き換えが完了したので、表示する
    if (pElement) {
        pElement.style.visibility = 'visible'; // p を表示
    }
    // (h1 は何もしない)
    // ★★★ 修正ここまで ★★★

    // (タイム表示やボタン処理...)
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
      });
    });

    //timeの設定
    //totalタイム（後で使うかも）
    // const a = isNaN(ufo_time) ? 0 : ufo_time;
    // const b = isNaN(debris_time) ? 0 : debris_time;
    // const c = isNaN(boss_time)? 0 : boss_time;
    // const total = a + b + c;

    //timeをテキスト形式に変換
    let houres = Math.floor(time / 360);
    let minutes = Math.floor((time % 360) / 60);
    let secs = time % 60;
    houres = houres < 10 ? `0${houres}` : `${houres}`;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    secs = secs < 10 ? `0${secs}` : `${secs}`;

    //textboxを取得、上書き
    const time_text = document.getElementById("crear_time");
    if(!(status === "debris_clear"))time_text.textContent = `${houres}:${minutes}:${secs}`;

    // ランキング処理
    // 1. どのランキングに保存するか、キーと値を決める
    let rankKey = "ranking_score"; // デフォルト
    let myRecord = 0;
    let isTimeRank = false; // タイム(低い順)かスコア(高い順)か

    if (status === 'boss_clear') {
        rankKey = "ranking_boss";   // ★BOSS専用の保存場所
        myRecord = window.boss_time; 
        isTimeRank = true;
    } else if (status === 'ufo_clear') {
        rankKey = "ranking_ufo";    // ★UFO専用の保存場所
        myRecord = window.ufo_time;
        isTimeRank = true;
    } else {
        // デブリ(スコア)の場合
        rankKey = "ranking_debris";
        const ds = sessionStorage.getItem("debris_score");
        myRecord = ds ? parseInt(ds) : 0;
        isTimeRank = false;
    }

    // 2. 過去のランキングデータを取得 
    let rankData = JSON.parse(localStorage.getItem(rankKey)) || [];

    // 3. 【リロード対策】「このセッションで登録済み」フラグが立っていない時だけ追加する
    if (!sessionStorage.getItem("has_ranked_flag")) {
        rankData.push({ name: "YOU", val: myRecord });

        // 並び替え
        if (isTimeRank) {
            rankData.sort((a, b) => a.val - b.val); // タイム：小さい順
        } else {
            rankData.sort((a, b) => b.val - a.val); // スコア：大きい順
        }

        // 3位まで保存
        rankData = rankData.slice(0, 3);
        localStorage.setItem(rankKey, JSON.stringify(rankData));
        
        //「登録フラグを立てる
        sessionStorage.setItem("has_ranked_flag", "true");
    }

    // 4. 画面に表示 (毎回行う)
    const rankUl = document.getElementById("ranking_list");
    if (rankUl) {
        rankUl.innerHTML = ""; // リセット
        
        // タイム表示用の変換関数
        const fmt = (t) => {
            let h = Math.floor(t/360); let m = Math.floor((t%360)/60); let s = t%60;
            return `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
        };

        rankData.forEach((d, i) => {
            const dispVal = isTimeRank ? fmt(d.val) : `${d.val} pt`;
            const li = document.createElement("li");
            li.innerHTML = `<h4 style="margin:5px 0;">${i+1}位</h4><h5 style="margin:0;">${d.name} : ${dispVal}</h5>`;
            rankUl.appendChild(li);
        });
    }

    // ボタンを取得
    function setupButton(id, url) {
      const btn = document.getElementById(id);
      btn.addEventListener('click', () => {
        const sound = new Audio('../assets/sounds/effects/button.mp3');
        sound.volume = 1.0;
        sound.currentTime = 0;
        sound.play().catch(() => {});
        // リロード対策のリセット
        sessionStorage.removeItem("has_ranked_flag");
        setTimeout(() => {
          window.location.href = url;
        }, 700);
      });
    }

    setupButton('Title_button', 'Title.html');

});




/*
<div id="clear-time">タイム: 読み込み中...</div>

<script>
  const params = new URLSearchParams(window.location.search); // URLの ?time=... を解析
  const time = params.get('time'); // time の値を取得

  if (time) {
    document.getElementById('clear_time').textContent = `タイム: ${time}`;
  } else {
    document.getElementById('clear_time').textContent = 'タイム: 不明';
  }
</script>
*/