let move = false;
window.attackloop = true;
setTimeout(()=>{
    move = true;
    enemy_start();
    player_start();
    hit_start();
    timer_start();
},5000);