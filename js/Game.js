(function () {
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
            //游戏速度
            this.lspeed = 0.8;
            //生成管子频率
            this.pNum = 240;
            //管子数组
            this.pipeArr =[];
            //加载所有资源
            this.loadResouce(function () {
                //开始游戏
                this.start();
                //点击监听
                this.bindEvent();
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
                    var imgNum = _.size(self.Robj);
                    for (var k in self.Robj) {
                        count++;
                        self.R[k] = new Image();
                        self.R[k].src = self.Robj[k];
                        self.R[k].onload = function () {
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
            //实例化背景
            self.background = new Background(self.lspeed);
            //实例化大地
            self.land = new Land(self.lspeed);
            //实例化小鸟
            self.bird = new Bird();
            self.background.rander();
            self.land.rander();
            self.bird.rander();
            this.timer = setInterval(function () {
                self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
                //设置帧编号
                self.f++;
                //每240帧生成一个管子
                if (self.f % self.pNum === 0){
                    new Pipe(self.lspeed);
                }

                //更新背景、大地、管道、小鸟
                self.background.update();
                self.background.rander();
                self.bird.update();
                self.bird.rander();
                self.land.update();
                self.land.rander();
                for (let i = 0; i < self.pipeArr.length ; i++) {
                    self.pipeArr[i].update();
                    self.pipeArr[i].rander();
                }
                self.ctx.textAlign = 'left';
                self.ctx.font = '10px Consolas';
                //输出帧编号
                self.ctx.fillText('FNO '+self.f,20,20);
            },40)
        },
        bindEvent :function () {
            this.canvas.onclick = () =>{this.bird.fly()}
        }
    })
})();