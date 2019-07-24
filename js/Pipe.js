(function () {
    //管子类
    var Pipe = window.Pipe = Class.extend({
        init : function () {
            this.imageDown = game.R['pipe_down'];
            this.imageUp = game.R['pipe2_up'];
            //管子位置
            this.x = game.canvas.width;
            //上管子高度
            this.height1 = 50 + parseInt(Math.random()*221);
            //间隙
            this.interspace = 120;
            //是否通过管子
            this.alreadyPass = false;
            //下管子高度
            this.height2 = game.canvas.height*0.78-this.interspace-this.height1;

            game.pipeArr.push(this);
        },
        rander :function () {
            var self = this;
            game.ctx.drawImage(this.imageDown,0,320-self.height1,52,self.height1,self.x,0,52,self.height1);
            game.ctx.drawImage(this.imageUp,0,0,52,self.height2,self.x,self.height1+self.interspace,52,self.height2)
            //测试数据
            // game.ctx.fillText(self.height1,this.x,100);
            // game.ctx.fillText(self.height1+self.interspace,this.x,350);
        },
        update : function () {
            var self = this;
            self.x-=game.lspeed;
            //检测碰撞
            if (game.bird.R>this.x && game.bird.L<this.x+52) {
                if (game.bird.T<this.height1 || game.bird.B>this.height1+this.interspace) {
                    game.sceneManager.enter(4);
                }
            }
            //加分
            if (game.bird.R>this.x+52 && !this.alreadyPass){
                game.scoll++;
                this.alreadyPass = true;
            }
            //管子退出屏幕时，移出数组
            if (self.x < -52) {
                game.pipeArr.shift();
            }
        }
    })
})();