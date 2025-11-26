window.attackloop = true;
window.move = true;
window.start = false;
const game_start = setInterval(()=>{
    if(start){
        if(typeof enemy_start === "function")enemy_start();
        if(typeof player_start === "function")player_start();
        if(typeof hit_start === "function")hit_start();
        if(typeof timer_start === "function")timer_start();
        if(typeof debris_start === "function")debris_start();
        clearInterval(game_start);
    }
}, 6)
game_start;