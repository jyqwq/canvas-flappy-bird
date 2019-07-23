(function () {
    var Bird = window.Bird = Class.extend({
        init :function () {
            this.color = parseInt(Math.random() * 3);
            this.imageArr = [
                game.R['bird'+this.color+'_0'],
                game.R['bird'+this.color+'_1'],
                game.R['bird'+this.color+'_2']
            ];
            this.wingStep = 0;
            //小鸟的物理位置
            this.x = game.canvas.width*(1-0.618) -24;
            this.y = 100;
            //小鸟的帧数
            this.fno = 0;
            //角度
            this.d = 0;
            //是否拥有能量
            this.hasEnergy = false;
        },
        rander :function () {
            game.ctx.save();
            game.ctx.translate(this.x,this.y);
            game.ctx.rotate(this.d);
            game.ctx.drawImage(this.imageArr[this.wingStep],-24,-24);
            game.ctx.restore();
            //测试数据
            // game.ctx.fillText(parseInt(this.T),this.x,this.y-12);
            // game.ctx.fillText(parseInt(this.R),this.x+17,this.y);
            // game.ctx.fillText(parseInt(this.B),this.x,this.y+12);
            // game.ctx.fillText(parseInt(this.L),this.x-17,this.y);
        },
        update :function () {
            game.f % 30 ===0 && this.wingStep++;
            //小鸟动画
            if (this.wingStep>2) {
                this.wingStep = 0;
            }
            //判断点击
            if (!this.hasEnergy) {
                //下落算法
                this.y +=this.fno*0.005;
                //最低点
                if (this.y>game.canvas.height*0.78){
                    this.y = game.canvas.height*0.78;
                    game.gameOver = true;
                }
            }else {
                //上升算法
                this.y -=(80-this.fno)*0.01;
                //最高点
                if (this.y <48) this.y = 48;
                //恢复下降
                if (this.fno >80){
                    this.hasEnergy = false;
                    this.fno = 0;
                }
            }
            this.fno++;
            //下落旋转角度
            if (this.d <0.8) {
                this.d +=0.005;
            }else {
                this.d = 0.8;
            }
            //碰撞体积
            this.T = this.y-12;
            this.R = this.x+17;
            this.B = this.y+12;
            this.L = this.x-17;

        },
        fly :function () {
            //点击事件触发
            this.hasEnergy = true;
            this.d = -0.6;
            this.fno = 0;
        }
    })
})();