"use strict";
var Block = (function () {
    function Block(player) {
        this.blockElemArray = [];
        this.xpos = [];
        this.allBlocks = Math.ceil(window.innerWidth / 1000);
        this.player = player;
        for (var i = 0; i < this.allBlocks; i++) {
            var tmpBlock = document.createElement('block');
            document.body.appendChild(tmpBlock);
            this.blockElemArray.push(tmpBlock);
            this.xpos[i] = i * 600;
        }
    }
    Block.prototype.update = function () {
        for (var i = 0; i < this.allBlocks; i++) {
            this.xpos[i] = this.xpos[i] + 5;
            this.blockElemArray[i].style.right = this.xpos[i] + 'px';
            var tmpPlayer = this.player.getPlayerElem().getBoundingClientRect();
            var tmpBlock = this.blockElemArray[i].getBoundingClientRect();
            if (this.player.score.getScore % 500 == 0) {
                var tmpWidth = tmpBlock.width * 1.2;
                if (tmpWidth > 150) {
                    tmpWidth = 150;
                }
                this.blockElemArray[i].style.width = tmpWidth + 'px';
            }
            if (!(tmpPlayer.right < tmpBlock.left ||
                tmpPlayer.left > tmpBlock.right ||
                tmpPlayer.bottom < tmpBlock.top ||
                tmpPlayer.top > tmpBlock.bottom)) {
                this.player.die();
            }
            if (this.xpos[i] >= window.innerWidth) {
                this.xpos[i] = 0;
                this.blockElemArray[i].style.bottom = Math.floor(Math.random() * (40 - 0 + 1)) + 0 + '%';
            }
        }
    };
    return Block;
}());
var Game = (function () {
    function Game() {
        var _this = this;
        this.startGame = function () {
            _this.startButton.remove();
            _this.introButton.remove();
            _this.player = new Player();
            _this.block = new Block(_this.player);
            document.body.appendChild(document.createElement('portal'));
            document.body.appendChild(document.createElement('portal2'));
            document.body.appendChild(document.createElement('spikes'));
            _this.update();
        };
        this.startButton = document.createElement('startgame');
        document.body.appendChild(this.startButton);
        this.startButton.innerHTML = "Start Game";
        this.introButton = document.createElement('intro');
        document.body.appendChild(this.introButton);
        this.introButton.innerHTML = "Crazy Portal Flap";
        this.startButton.addEventListener('click', this.startGame);
    }
    Game.prototype.update = function () {
        var _this = this;
        this.player.update();
        this.block.update();
        requestAnimationFrame(function () { return _this.update(); });
    };
    return Game;
}());
window.addEventListener("load", function () { return new Game(); });
var Player = (function () {
    function Player() {
        var _this = this;
        this.jumpSpeed = 60;
        this.isFalling = false;
        this.isDead = false;
        this.checkSpacePress = function (e) {
            if (_this.isDead === false) {
                _this.isFalling = false;
                if (e.keyCode == 32) {
                    _this.jumpSpeed = _this.jumpSpeed + 15;
                    _this.playerElem.style.bottom = _this.jumpSpeed + 'px';
                    if (_this.jumpSpeed >= window.innerHeight) {
                        _this.jumpSpeed = 60;
                    }
                }
            }
        };
        this.fallDown = function () {
            _this.isFalling = true;
        };
        this.getPlayerElem = function () {
            return _this.playerElem;
        };
        this.playerElem = document.createElement('player');
        document.body.appendChild(this.playerElem);
        this.score = new Score(this);
        document.body.addEventListener('keypress', this.checkSpacePress);
        document.body.addEventListener('keyup', this.fallDown);
    }
    Player.prototype.update = function () {
        this.score.update();
        if (this.isDead === false) {
            if (this.isFalling) {
                this.jumpSpeed = this.jumpSpeed - 5;
                this.playerElem.style.bottom = this.jumpSpeed + 'px';
                if (this.jumpSpeed <= 40) {
                    this.isFalling = false;
                    this.die();
                }
            }
        }
    };
    Object.defineProperty(Player.prototype, "isAlive", {
        get: function () {
            return this.isDead ? false : true;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.die = function () {
        if (this.isDead === false) {
            this.playerElem = document.createElement('dead');
            document.body.appendChild(this.playerElem);
            this.playerElem.style.bottom = this.jumpSpeed + 'px';
            this.isDead = true;
            var opacityObject = document.createElement('opacity');
            document.body.appendChild(opacityObject);
            var tmpRestart = document.createElement('restart');
            document.body.appendChild(tmpRestart);
            tmpRestart.innerHTML = "Restart Game";
            tmpRestart.style.zIndex = "999";
            var endScore = document.createElement('endscore');
            document.body.appendChild(endScore);
            endScore.innerHTML = "Score: " + this.score.getScore;
            document.body;
            tmpRestart.addEventListener('click', function () {
                location.reload();
            });
        }
    };
    return Player;
}());
var Score = (function () {
    function Score(player) {
        var _this = this;
        this.scoreCounter = 0;
        this.update = function () {
            if (_this.player.isAlive === true) {
                _this.scoreCounter++;
                _this.scoreElem.innerHTML = "Score: " + _this.scoreCounter;
            }
        };
        this.player = player;
        this.scoreElem = document.createElement('score');
        document.body.appendChild(this.scoreElem);
        this.scoreElem.innerHTML = "Score: ";
    }
    Object.defineProperty(Score.prototype, "getScore", {
        get: function () {
            return this.scoreCounter;
        },
        enumerable: true,
        configurable: true
    });
    return Score;
}());
//# sourceMappingURL=main.js.map