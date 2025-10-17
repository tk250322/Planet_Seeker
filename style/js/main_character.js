// 読みこまれたら実行
document.addEventListener('DOMContentLoaded', function() {
    //キャラのidを取得
    const player = document.getElementById('player');
    
    // キャラの移動
    document.addEventListener('keydown', function(event){
        // px
        // 上に移動する
        if (event.key === 'ArrowUp'){
            console.log('上矢印キーが押されました');
        }
        else if (event.key === 'ArrowDown'){
            console.log('下矢印キーが押されました');
        }
        else if (event.key === 'ArrowLeft'){
            console.log('左矢印キーが押されました');
        }
        else if (event.key === 'ArrowRight'){
            console.log('右矢印キーが押されました');
        }
    });
});