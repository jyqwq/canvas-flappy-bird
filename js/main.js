(function () {
    //类重定义
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    this.Class = function(){};
    Class.extend = function(prop) {
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }
        function Class() {
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        return Class;
    };
    //游戏类
    var Game = window.Game = Class.extend({
        //构造函数
        init : function (id) {
            this.canvas = document.getElementById(id);
            this.ctx = this.canvas.getContext('2d');
            //R文件路径
            this.RtextURL = 'R.json';
            //自己的图片资源对象，v是图片路径
            this.Robj = null;
            //自己的图片资源对象，v是图片对象
            this.R = {};
            //帧编号
            this.f = 0;
            //游戏刷新频率
            this.fps = 20;
            //游戏速度
            this.lspeed = 3;
            //生成管子频率
            this.pNum = 100;
            //下落参数
            this.dropNum = 0.25;
            //上升参数
            this.upNum = 0.25;
            //加载所有资源
            this.loadResouce(function () {
                //开始游戏
                this.start();
            });
        },
        loadResouce : function (callback) {
            var self = this;
            var count = 0;
            self.ctx.textAlign = "center";
            self.ctx.font = "20px 微软雅黑";
            self.ctx.fillText("正在加载...",self.canvas.width/2,self.canvas.height*(1-0.618));
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                    self.Robj = JSON.parse(xhr.responseText);
                    var imgNum = Object.keys(self.Robj).length;
                    for (var k in self.Robj) {
                        self.R[k] = new Image();
                        self.R[k].src = self.Robj[k];
                        self.R[k].onload = function () {
                            count++;
                            self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
                            self.ctx.textAlign = "center";
                            self.ctx.font = "20px 微软雅黑";
                            self.ctx.fillText("正在加载"+count+"/"+imgNum,self.canvas.width/2,self.canvas.height*(1-0.618));
                            if (count === imgNum) {
                                callback.call(self)
                            }
                        }
                    }
                }
            };

            xhr.open("get",self.RtextURL,true);
            xhr.send(null);
        },
        start : function () {
            var self = this;
            //场景管理器
            self.sceneManager = new SceneManager();

            var mainTimer = setInterval(function () {
                self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
                //设置帧编号
                self.f++;

                //更新场景
                self.sceneManager.update();
                self.sceneManager.rander();

                self.ctx.textAlign = 'left';
                self.ctx.font = '10px Consolas';
                //输出帧编号
                self.ctx.fillText('FNO '+self.f,20,20);
                self.ctx.fillText('场景号 '+self.sceneManager.sceneNum,20,50);
            },self.fps);
        }
    });
    //背景类
    var Background = window.Background = Class.extend({
        init : function () {
            //自己的背景
            this.image = game.R['bg_night'];
            this.x = 0;
        },
        rander : function () {
            var self = this;
            game.ctx.drawImage(self.image,-self.x,0,game.canvas.width,game.canvas.height);
            game.ctx.drawImage(self.image,-self.x+game.canvas.width,0,game.canvas.width,game.canvas.height)
        },
        update : function () {
            var self = this;
            self.x+=(game.lspeed-0.2);
            if (self.x > game.canvas.width) {
                self.x=0;
            }
        }
    });
    //大地类
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
    });
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
    });
    //小鸟类
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
        },
        update :function () {
            this.wind();
            //判断点击
            if (!this.hasEnergy) {
                //下落算法
                this.y +=this.fno*game.dropNum;
                //最低点
                if (this.y>game.canvas.height*0.78){
                    game.sceneManager.enter(4);
                }
            }else {
                //上升算法
                this.y -=(20-this.fno)*game.upNum;
                //最高点
                if (this.y <48) this.y = 48;
                //恢复下降
                if (this.fno >20){
                    this.hasEnergy = false;
                    this.fno = 0;
                }
            }
            this.fno++;
            //下落旋转角度
            if (this.d <0.8) {
                this.d +=0.05;
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
        },
        wind :function () {
            game.f % 10 ===0 && this.wingStep++;
            //小鸟动画
            if (this.wingStep>2) {
                this.wingStep = 0;
            }
        }
    });
    //场景管理器
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
                this.logoY+=2;
                this.playY-=3;
                if (this.logoY>120) this.logoY = 120;
                if (this.playY<250) this.playY = 250;
            }else if (this.sceneNum === 2) {
                this.tutorialOpacity += this.isDownTutorialOpacity? -0.05:0.05;
                if (this.tutorialOpacity<0.05 || this.tutorialOpacity>0.95) this.isDownTutorialOpacity = !this.isDownTutorialOpacity;
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
                    game.bird.y+=this.bfno;
                }else {
                    game.f%2 ===0 && this.bStep++;
                    if (this.bStep>29) {
                        this.bStep=29;
                        game.sceneManager.enter(5);
                    }
                }
                if(game.f%3 ===0) game.ctx.globalAlpha += 0.1;
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
