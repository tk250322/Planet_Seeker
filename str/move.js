window.attackloop = true;
window.move = true;
setTimeout(()=>{
    if(typeof enemy_start === "function")enemy_start();
    if(typeof player_start === "function")player_start();
    if(typeof hit_start === "function")hit_start();
    if(typeof timer_start === "function")timer_start();
},5000);