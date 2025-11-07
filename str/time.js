document.addEventListener('DOMContentLoaded', function() {

  // ページ読み込み時にタイマー開始
  window.onload = () => {
    let seconds = 0;
    let timer;
  
  window.timer_start = function(){
    timer = setInterval(() => {
      if(move){
        seconds++;
        updateTimerDisplay();
      }
    }, 1000);

    document.getElementById("timer").style.display = "block";
  }
  // };

  function updateTimerDisplay() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedTime =
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    document.getElementById('timer').textContent = formattedTime;
  }

  /*
  //敵を倒したときにタイマー停止
  function onEnemyDefeated() { // onEnemyDefeatedが敵を倒したタイミング
    clearInterval(timer);

    const finalTime = document.getElementById('timer').textContent;
    const encodedTime = encodeURIComponent(finalTime); // 

    // タイムをクエリパラメータとして渡す
    window.location.href = `result.html?time=${encodedTime}`;
  }
  */


}});