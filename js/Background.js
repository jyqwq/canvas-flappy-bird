(function () {
    //背景类
    var Background = window.Background = Class.extend({
        init : function (s) {
            //自己的背景
            this.image = game.R['bg_night'];
            this.x = 0;
            this.speed = s;
        },
        rander : function () {
            var self = this;
            game.ctx.drawImage(self.image,-self.x,0,game.canvas.width,game.canvas.height);
            game.ctx.drawImage(self.image,-self.x+game.canvas.width,0,game.canvas.width,game.canvas.height)
        },
        update : function () {
            var self = this;
            self.x+=(this.speed-0.2);
            if (self.x > game.canvas.width) {
                self.x=0;
            }
        }
    })
})();