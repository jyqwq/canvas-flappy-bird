(function () {
    var SceneManager = window.SceneManager = Class.extend({
        init :function () {
            //场景号1：欢迎界面 场景号2：游戏教程界面 场景号3：游戏界面 场景号4：死亡动画界面 场景号5：game over界面
            this.sceneNum = 1;
            this.logoY = -48;
            this.playY = game.canvas.height;
            this.playX = game.canvas.width/2-58;
            //实例化背景
            game.background = new Background();
            //实例化大地
            game.land = new Land();
            //实例化小鸟
            game.bird = new Bird();
            //点击监听
            this.eventBind();
        },
        update :function () {
            if (this.sceneNum === 1) {
                game.bird.x = game.canvas.width/2;
                game.bird.y = 210;
                this.logoY+=0.2;
                this.playY-=0.3;
                if (this.logoY>120) this.logoY = 120;
                if (this.playY<250) this.playY = 250;
            }else if (this.sceneNum === 2) {
                this.tutorialOpacity += this.isDownTutorialOpacity? -0.005:0.005;
                if (this.tutorialOpacity<0.005 || this.tutorialOpacity>0.995) this.isDownTutorialOpacity = !this.isDownTutorialOpacity;
                game.bird.wind();
            }else if (this.sceneNum === 3) {
                //间隔self.pNum帧生成一个管子
                if (game.pfno % game.pNum === 0) new Pipe();
                game.background.update();
                game.land.update();
                for (var i = 0; i < game.pipeArr.length ; i++) {
                    game.pipeArr[i].update();
                }
                if (game.bird.x >game.canvas.width*(1-0.618) -24) {
                    game.bird.x -=game.lspeed;
                }
                game.bird.update();
            }else if (this.sceneNum === 4) {
                if (game.bird.y>game.canvas.height*0.78-20) this.isButtom = true;
                this.bfno++;
                if(!this.isButtom){
                    game.bird.y+=0.005*this.bfno;
                }else {
                    game.f%10 ===0 && this.bStep++;
                    if (this.bStep>29) {
                        this.bStep=29;
                        game.sceneManager.enter(5);
                    }
                }
                if(game.f%15 ===0) game.ctx.globalAlpha += 0.1;
                if (game.ctx.globalAlpha>0.99) game.ctx.globalAlpha = 1;
            }else if (this.sceneNum === 5) {

            }
        },
        rander :function () {
            if (this.sceneNum === 1) {
                game.background.rander();
                game.land.rander();
                game.bird.rander();
                game.ctx.drawImage(game.R['logo'],game.canvas.width/2-89,this.logoY);
                game.ctx.drawImage(game.R['play'],game.canvas.width/2-58,this.playY);
            }else if (this.sceneNum === 2) {
                game.background.rander();
                game.land.rander();
                game.bird.rander();
                game.ctx.save();
                game.ctx.globalAlpha = this.tutorialOpacity;
                game.ctx.drawImage(game.R['tutorial'],game.canvas.width/2-57,200);
                game.ctx.restore();
            }else if (this.sceneNum === 3) {
                game.pfno ++;
                game.background.rander();
                game.land.rander();
                for (let i = 0; i < game.pipeArr.length ; i++) {
                    game.pipeArr[i].rander();
                }
                game.bird.rander();
                //打印分数
                let sl = game.scoll.toString().length;
                for (let j = 0; j < sl; j++) {
                    game.ctx.drawImage(game.R['fenshu'+game.scoll.toString().charAt(j)],game.canvas.width/2-sl/2*34+34*j,70)
                }
            }else if (this.sceneNum === 4) {
                game.background.rander();
                game.land.rander();
                for (let i = 0; i < game.pipeArr.length ; i++) {
                    game.pipeArr[i].rander();
                }
                if (this.isButtom) {
                    game.ctx.drawImage(game.R['b'+this.bStep],30,45,70,80,game.bird.x-38,game.bird.y-38,70,80)
                } else {
                    game.bird.rander();
                }
                //打印分数
                let sl = game.scoll.toString().length;
                for (let j = 0; j < sl; j++) {
                    game.ctx.drawImage(game.R['fenshu'+game.scoll.toString().charAt(j)],game.canvas.width/2-sl/2*34+34*j,70)
                }

            }else if (this.sceneNum === 5) {
                game.background.rander();
                game.land.rander();
                for (let i = 0; i < game.pipeArr.length ; i++) {
                    game.pipeArr[i].rander();
                }
                //打印分数
                let sl = game.scoll.toString().length;
                for (let j = 0; j < sl; j++) {
                    game.ctx.drawImage(game.R['fenshu'+game.scoll.toString().charAt(j)],game.canvas.width/2-sl/2*34+34*j,70)
                }
                game.ctx.drawImage(game.R['text_game_over'],game.canvas.width/2-102,220)
            }
        },
        enter :function (number) {
            this.sceneNum = number;
            if (this.sceneNum === 1) {
                this.logoY = -48;
                this.playY = game.canvas.height;
            }else if (this.sceneNum === 2) {
                game.bird.y = 100;
                this.tutorialOpacity = 1;
                this.isDownTutorialOpacity = true;
            }else if (this.sceneNum === 3) {
                game.pfno = 1;
                game.pipeArr = [];
                game.scoll = 0;
            }else if (this.sceneNum === 4) {
                game.ctx.globalAlpha = 0;
                this.bStep = 1;
                this.isButtom = false;
                this.bfno = 0;
            }else if (this.sceneNum === 5) {

            }
        },
        eventBind :function () {
            var self = this;
            game.canvas.onclick = function (e) {
                handler(e.clientX,e.clientY);
            };
            game.canvas.addEventListener('touchstart',function (e) {
                e.preventDefault();
                var finger = e.touches[0];
                handler(finger.clientX,finger.clientY)
            });
            function handler(cX,cY) {
                if (cX>self.playX && cX<self.playX+116 && cY>self.playY && cY<self.playY+70 && self.sceneNum === 1) {
                    self.enter(2)
                }else if (self.sceneNum === 2) {
                    self.enter(3)
                }else if (self.sceneNum === 3) {
                    game.bird.fly();
                }else if (self.sceneNum === 5) {
                    game.bird = new Bird();
                    game.sceneManager.enter(1)
                }
            }
        }
    })
})();