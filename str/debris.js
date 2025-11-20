    const enemydownSound = new Audio('../assets/sounds/effects/enemy_down.mp3'); 
    enemydownSound.preload = 'auto';
    enemydownSound.volume = 0.5;

document.addEventListener('DOMContentLoaded', function() {
    //debrisの準備
    window.debris = "debris.js読み込み完了";
    console.log(debris);

    //スコア
    window.score = 0;

    //攻撃
    class Debris{
        constructor(){
            this.pos_type = Math.floor(Math.random() * 3);
            this.img_type = Math.floor(Math.random() * 10);
            this.x;
            this.y;
            this.attack_type = Math.floor(Math.random() * 5);
            this.speed = 4;
            this.pos = this.create();
            this.width;
            this.height;
            this.hp;
        }

        vec(){
            switch(this.pos_type){
              case 0:
                this.x = 0;
                this.y = Math.floor(Math.random() * 500) + 50;
                break;
              case 1:
                this.x = Math.floor(Math.random() * 250) + 20;
                this.y = 0;
                break;
              case 2:
                this.x = Math.floor(Math.random() * 250) + 20;
                this.y = 600;
                break;
            }
        }

        //生成
        create(){
            if(player_hp === 0 || isGamePaused || !move)return;
            console.log("デブリが落ちてくるよ！！気をつけて！！");
            const pos = document.createElement("img");
            switch(this.img_type){
              case 0:
                pos.src = "../assets/images/rare_debris.png";
                pos.className = "debris";
                this.hp = 1;
                break;
              case 1:
              case 2:
              case 3:
                pos.src = "../assets/images/debris_fire_1.png";
                pos.className = "big_debris";
                this.hp = 2;
                break;
              default:
                pos.src = "../assets/images/debris.png";
                pos.className = "debris";
                this.hp = 1
                break;
            }
            this.vec();
            pos.style.top = `${this.x}px`;
            pos.style.left = `${this.y}px`;
            document.getElementById("game_play_area").appendChild(pos);
            this.height = pos.offsetHeight;
            this.width = pos.offsetWidth;
            return pos;
        }

        //移動
        move(pos){
            if(player_hp === 0 || !move || isGamePaused)return;
            const attack_move = setInterval(()=>{
                const top = parseFloat(pos.style.top);
                const left = parseFloat(pos.style.left);
                const speed = this.speed;
                if(!isGamePaused && move){switch(this.attack_type){
                  case 0:
                    pos.style.top = `${top + speed}px`;
                    break;
                  case 1:
                    if(this.pos_type === 2){
                        pos.style.left = `${left - speed}px`;
                        break;
                    }
                    pos.style.top = `${top + speed/5*4}px`;
                    pos.style.left = `${left + speed/5*3}px`;
                    break;
                  case 2:
                    if(this.pos_type === 2){
                        pos.style.top = `${top + speed/2}px`;
                        pos.style.left = `${left - speed/2*Math.sqrt(3)}px`;
                        break;
                    }

                    pos.style.top = `${top + speed/5*3}px`;
                    pos.style.left = `${left + speed/5*4}px`;
                    break;
                  case 3:
                    if(this.pos_type === 1){
                        pos.style.left = `${left + speed}px`;
                        break;
                    }
                    pos.style.top = `${top + speed/5*4}px`;
                    pos.style.left = `${left - speed/5*3}px`;
                    break;
                  case 4:
                    if(this.pos_type === 1){
                        pos.style.top = `${top + speed/2}px`;
                        pos.style.left = `${left  + speed/2*Math.sqrt(3)}px`;
                        break;
                    }
                    pos.style.top = `${top + speed/5*3}px`;
                    pos.style.left = `${left - speed/5*4}px`;
                    break;
                }}

                //攻撃削除
                if(top >= 600 || left < - this.width || left > 600){
                    pos.remove();
                    clearInterval(attack_move);
                }

                //ダメージ
                const p_pos = document.getElementById("player-pos");
                const p_top = parseInt(p_pos.style.top);
                const p_left = parseInt(p_pos.style.left);
                const bullet_damage = top < p_top + 30 && top + this.height > p_top &&
                    left < p_left + 30 && left + this.width > p_left;
                if(bullet_damage && player_hit_pos){
                    damage();
                    pos.remove();
                    clearInterval(attack_move);
                }

                //破壊
                const p_b = document.getElementsByClassName("player_bullet");
                for(let i = 0; i < p_b.length; i++){
                    const b_top = parseInt(p_b[i].style.top) + 4;
                    const b_left = parseInt(p_b[i].style.left) + 4;
                    const hit = top < b_top + 22 && top + this.height > b_top &&
                    left < b_left + 22 && left + this.width > b_left;
                    if(hit){
                        p_b[i].remove();
                        this.hp--;
                        switch(this.img_type){
                          case 1:
                          case 2:
                          case 3:
                            pos.src = "../assets/images/debris_fire.png";
                        }
                    }
                }
                if(this.hp === 0){
                    //爆発
                    pos.src = "../assets/images/enemy_ex.png";
                    switch(this.img_type){
                      case 0:
                        score += 700;
                        pos.style.height = "100px";
                        pos.style.width = "100px";
                        pos.style.top = `${top - 30}px`;
                        pos.style.left = `${left - 30}px`;                        
                      case 1:
                      case 2:
                      case 3:
                        score += 300;
                        pos.style.height = "140px";
                        pos.style.width = "140px";
                        pos.style.top = `${top - 30}px`;
                        pos.style.left = `${left - 30}px`;
                        break;
                      default:
                        score += 100;
                        pos.style.height = "100px";
                        pos.style.width = "100px";
                        pos.style.top = `${top - 30}px`;
                        pos.style.left = `${left - 30}px`;
                        break;
                    }


                    const newSoundInstance = enemydownSound.cloneNode(true); 
                    newSoundInstance.play();
                    clearInterval(attack_move);
                    setTimeout(()=>{
                        pos.remove();
                    }, 200);

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
        }, 200)}
    }

    window.debris_start = function(){
        const d = new Debris();
        d.move(d.pos);
        d.timer();
    }
});