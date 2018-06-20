"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Highscore = (function () {
    function Highscore() {
        this._highScoreList = this.getCookie('highscore');
        if (this._highScoreList === null) {
            this.setCookie('highscore', [1203, 1234, 1238], 300);
        }
        this._highScoreList = this.getCookie('highscore').split(',');
    }
    Highscore.prototype.setCookie = function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };
    Highscore.prototype.getCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    };
    return Highscore;
}());
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
            var allHighscores = this.score.highScoreList;
            allHighscores.push(this.score.getScore);
            allHighscores.sort(function (a, b) { return b - a; });
            this.score.setCookie('highscore', allHighscores, 999);
            var highscoreElem = document.createElement('highscore');
            document.body.appendChild(highscoreElem);
            highscoreElem.innerHTML = "<ul><li style='font-size:25px'>Top 10 Highscores</li></ul>";
            var highscoreList = highscoreElem.getElementsByTagName('ul')[0];
            for (var i = 0; i < (allHighscores.length > 10 ? 10 : allHighscores.length); i++) {
                var tmpLi = document.createElement('li');
                tmpLi.innerHTML = allHighscores[i];
                highscoreList.appendChild(tmpLi);
            }
            tmpRestart.addEventListener('click', function () {
                location.reload();
            });
        }
    };
    return Player;
}());
var Score = (function (_super) {
    __extends(Score, _super);
    function Score(player) {
        var _this = _super.call(this) || this;
        _this.scoreCounter = 0;
        _this.update = function () {
            if (_this.player.isAlive === true) {
                _this.scoreCounter++;
                _this.scoreElem.innerHTML = "Score: " + _this.scoreCounter;
            }
        };
        _this.player = player;
        _this.scoreElem = document.createElement('score');
        document.body.appendChild(_this.scoreElem);
        _this.scoreElem.innerHTML = "Score: ";
        return _this;
    }
    Object.defineProperty(Score.prototype, "getScore", {
        get: function () {
            return this.scoreCounter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Score.prototype, "highScoreList", {
        get: function () {
            return this._highScoreList;
        },
        enumerable: true,
        configurable: true
    });
    return Score;
}(Highscore));
//# sourceMappingURL=main.js.map