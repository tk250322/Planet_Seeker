document.addEventListener('DOMContentLoaded', function() {
    //debrisの準備
    let debris = "debris.js読み込み完了";
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
            const attack_move = setInterval(()=>{
                const top = parseFloat(pos.style.top);
                const left = parseFloat(pos.style.left);
                const speed = this.speed;
                switch(this.type){
                  case 0:
                    pos.style.top = `${top + speed}px`;
                    break;
                  case 1:
                    pos.style.top = `${top + speed/4}px`;
                    pos.style.left = `${left + speed/3}px`;
                    break;
                  case 2:
                    pos.style.top = `${top + speed/3}px`;
                    pos.style.left = `${left + speed/4}px`;
                    break;
                  case 3:
                    pos.style.top = `${top + speed/4}px`;
                    pos.style.left = `${left - speed/3}px`;
                    break;
                  case 4:
                    pos.style.top = `${top + speed/3}px`;
                    pos.style.left = `${left - speed/4}px`;
                    break;
                }
                if(top >= 600 || left < -30 || left > 530){
                    pos.remove();
                    clearInterval(attack_move);
                }
            }, 16);
        }
    // function random_number(){
    // return Math.floor(Math.random() * 570);
    // }

    // //攻撃の位置
    // const x = -30;
    // let y;
    // function renewal(){
    //     setInterval(()=>{
    //         y = random_number();
    //     }, 16);
    // }
    

    // //攻撃発射
    // function attack(){
    //     console.log("デブリが落ちてくるよ！！気をつけて！！");
    //     const pos = document.createElement("img");
    //     pos.className = "debris";
    //     pos.src = "../assets/images/big_debris.png";
    //     pos.style.top = `${x}px`;
    //     pos.style.left = `${y}px`;
    //     document.getElementById("game_play_area").appendChild(pos);

    //     const speed = 4;
    //     const attack_move = setInterval(()=>{
    //         const top = parseInt(pos.style.top);
    //         pos.style.top = `${top + speed}px`;
    //         if(top >= 600){
    //             pos.remove();
    //             clearInterval(attack_move);
    //         }
    //     }, 16);
    // }

    //攻撃生成タイミング
        timer(){setInterval(()=>{
            const newDebris = new Debris();
            newDebris.move(newDebris.pos);
        }, 800)}
    }
    window.debris_start = function(){
        const d = new Debris();
        d.timer();
    }
});