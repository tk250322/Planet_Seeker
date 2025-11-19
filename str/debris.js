document.addEventListener('DOMContentLoaded', function() {
    //debrisの準備
    window.debris = "debris.js読み込み完了";
    console.log(debris);

    //攻撃
    class Debris{
        constructor(){
            this.x = -30;
            this.y = Math.floor(Math.random() * 530);
            this.type = Math.floor(Math.random()* 5);
            this.speed = 4;
            this.pos = this.create();
        }

        //生成
        create(){
            if(player_hp === 0 || isGamePaused || !move)return;
            console.log("デブリが落ちてくるよ！！気をつけて！！");
            const pos = document.createElement("img");
            pos.className = "debris";
            pos.src = "../assets/images/big_debris.png";
            pos.style.top = `${this.x}px`;
            pos.style.left = `${this.y}px`;
            document.getElementById("game_play_area").appendChild(pos);
            return pos;
        }

        //移動
        move(pos){
            if(player_hp === 0 || !move || isGamePaused)return;
            const attack_move = setInterval(()=>{
                const top = parseFloat(pos.style.top);
                const left = parseFloat(pos.style.left);
                const speed = this.speed;
                if(!isGamePaused && move){switch(this.type){
                  case 0:
                    pos.style.top = `${top + speed}px`;
                    break;
                  case 1:
                    pos.style.top = `${top + speed/5*4}px`;
                    pos.style.left = `${left + speed/5*3}px`;
                    break;
                  case 2:
                    pos.style.top = `${top + speed/5*3}px`;
                    pos.style.left = `${left + speed/5*4}px`;
                    break;
                  case 3:
                    pos.style.top = `${top + speed/5*4}px`;
                    pos.style.left = `${left - speed/5*3}px`;
                    break;
                  case 4:
                    pos.style.top = `${top + speed/5*3}px`;
                    pos.style.left = `${left - speed/5*4}px`;
                    break;
                }}

                //攻撃削除
                if(top >= 600 || left < -30 || left > 530){
                    pos.remove();
                    clearInterval(attack_move);
                }

                const p_pos = document.getElementById("player-pos");
                const p_top = parseInt(p_pos.style.top);
                const p_left = parseInt(p_pos.style.left);
                const hit = top + 32 < p_top + 30 && top + 68 > p_top &&
                    left + 32 < p_left + 30 && left + 68 > p_left;
                if(hit && player_hit_pos){
                    damage();
                    pos.remove();
                    clearInterval(attack_move);
                }

                if(player_hp === 0){
                    pos.remove();
                    clearInterval(attack_move);
                }
            }, 16);
        }

        //攻撃生成タイミング
        timer(){setInterval(()=>{
            const newDebris = new Debris();
            newDebris.move(newDebris.pos);
        }, 400)}
    }
    window.debris_start = function(){
        const d = new Debris();
        d.move(d.pos);
        d.timer();
    }
});