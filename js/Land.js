(function () {
    var Land = window.Land = Class.extend({
        init : function () {
            //自己的背景
            this.image = game.R['land'];
            this.l = 0;
        },
        rander : function () {
            var self = this;
            game.ctx.drawImage(self.image,-self.l,game.canvas.height*0.78,game.canvas.width,game.canvas.height*0.3);
            game.ctx.drawImage(self.image,-self.l+game.canvas.width,game.canvas.height*0.78,game.canvas.width,game.canvas.height*0.3)
        },
        update : function () {
            var self = this;
            self.l+=game.lspeed;
            if (self.l > game.canvas.width) {
                self.l=0;
            }
        }
    })
})();