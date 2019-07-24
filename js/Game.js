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
            //游戏刷新频率
            this.fps = 100;
            //游戏速度
            this.lspeed = 0.3;
            //生成管子频率
            this.pNum = 800;
            //下落参数
            this.dropNum = 0.002;
            //上升参数
            this.upNum = 0.006;
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
    })
})();