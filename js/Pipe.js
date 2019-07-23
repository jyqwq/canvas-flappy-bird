(function () {
    //管子类
    var Pipe = window.Pipe = Class.extend({
        init : function (s) {
            this.speed = s;
            this.imageDown = game.R['pipe_down'];
            this.imageUp = game.R['pipe2_up'];
            //管子位置
            this.x = game.canvas.width;
            //上管子高度
            this.height1 = 50 + parseInt(Math.random()*221);
            //间隙
            this.interspace = 120;
            //下管子高度
            this.height2 = game.canvas.height*0.78-this.interspace-this.height1;

            game.pipeArr.push(this);
        },
        rander :function () {
            var self = this;
            game.ctx.drawImage(this.imageDown,0,320-self.height1,52,self.height1,self.x,0,52,self.height1);
            game.ctx.drawImage(this.imageUp,0,0,52,self.height2,self.x,self.height1+self.interspace,52,self.height2)
        },
        update : function () {
            var self = this;
            self.x-=this.speed;
            //管子退出屏幕时，移出数组
            if (self.x === -game.canvas.width-52) {
                game.pipeArr.shift()
            }
        }
    })
})();