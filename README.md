# Crazy Portal Flap
Link naar de game:
- https://branksz.github.io

# Tutorial & Game uitleg
Voordat je de game gaat spelen moet ik een paar punten opnoemen, want anders is het waarschijnlijk te moeilijk om te snappen:<br>
- Om omhoog te gaan moet je de spatiebalk ingedrukt houden en los laten. Dus niet de hele tijd op de spatiebalk drukken maar ingedrukt houden en als je op 
de ideale hoogte bent los laten. Je kan het vergelijke met een koppeling van een auto, hierbij moet je ook die 'sweet spot' vinden.
- Je gaat sneller omhoog dan omlaag, dit heb ik express gemaakt om het net iets moeilijker te maken.
- De balken die op je af komen worden elke 500 punten steeds breder, de maximum breedte is bereikt wanneer de balken 150px breed zijn
- Er zijn twee portals, als je bij de onderste portal bent ga je dood. Door het bovenste portal kan je teleporteren naar benenden, maar van de onderste portal niet naar boven!
- Bovenaan bij het blauwe portal is de veiligste plek
- Ik ben benieuwd naar je highscore ;-)

### Extra opdrachten 

- [x] De game bevat een hiscore lijst. Scores worden bewaard nadat de game is afgesloten.


# Toelichting OOP
## Classes
Mijn gehele game bestaat uiteraard uit classes. Dit kan je zien in de DEV map, elk bestand is een aparte class. <br />
Hieronder de code van mijn Game.ts class:
```
class Game {

    private player:Player
    private block:Block
    private startButton:HTMLElement
    private introButton:HTMLElement

    constructor(){

        // Start game buttons neerzetten
        this.startButton = document.createElement('startgame')
        document.body.appendChild(this.startButton)

        this.startButton.innerHTML = "Start Game"

        this.introButton = document.createElement('intro')
        document.body.appendChild(this.introButton)

        this.introButton.innerHTML = "Crazy Portal Flap"

        this.startButton.addEventListener('click', this.startGame)
        // start game als je op de button klikt
    }

    public update() {

        this.player.update()
        this.block.update()

        requestAnimationFrame( () => this.update() )
    }

    private startGame=()=> {

        this.startButton.remove()
        this.introButton.remove()

        this.player = new Player()

        this.block = new Block(this.player) // enemy block

        // 2 portals aanmaken
        document.body.appendChild(document.createElement('portal'))
        document.body.appendChild(document.createElement('portal2'))

        // spikes aanmaken
        document.body.appendChild(document.createElement('spikes'))

        this.update() // update de game
    }

}

window.addEventListener("load", () => new Game())
```

## Encapsulation & Composition
Hiermee beveilig je methods en variabelen, je zorgt er dan voor dat andere stukken code er niet bij kunnen. Ik werk eigenlijk volgens het principe dat ik al mijn
variabele private maak, tenzij het echt public moet zijn of tenzij de variabele door een extend class benaderd moet worden. In dat geval gebruik ik protected.<br><br>

In deze code maak ik ook gebruik van composition. Ik wil dat de score in de player wordt aangemaakt, want de score hoort bij de player.<br><br>
Hieronder een stukje voorbeeldcode uit mijn Player.ts class
```
class Player {

	private playerElem:HTMLElement
	private jumpSpeed:number = 60
	private isFalling:boolean = false
	private isDead:boolean = false
	public score:Score

	constructor() {

		this.playerElem = document.createElement('player') // player aanmaken
        document.body.appendChild(this.playerElem)

        this.score = new Score(this)

        // eventlistener op spatie zetten
        document.body.addEventListener('keypress', this.checkSpacePress)
        document.body.addEventListener('keyup', this.fallDown)
	}

	public update() {

		this.score.update() // score updaten

		// alleen uitvoeren als die niet dood is
		if (this.isDead === false) {
			/* Als je de knop hebt los gelaten is this.isFalling true, 
			 dan moet je blijven vallen totdat je beneden bent */
			if (this.isFalling) {
				this.jumpSpeed = this.jumpSpeed - 5
				this.playerElem.style.bottom = this.jumpSpeed + 'px'

				if (this.jumpSpeed <= 40) {
					this.isFalling = false
					
					this.die() // player is dood
				}
			}
		}
	}

	public checkSpacePress=(e:any)=> {

		// alleen uitvoeren als die niet dood is
		if (this.isDead === false) {
			// niet naar beneden vallen
			this.isFalling = false

			if (e.keyCode == 32) {
				// Spacebar is gedrukt
				this.jumpSpeed = this.jumpSpeed + 15
				this.playerElem.style.bottom = this.jumpSpeed + 'px'

				// mag niet boven scherm uitkomen
				if (this.jumpSpeed >= window.innerHeight) {
					this.jumpSpeed = 60
				}
			}			
		}
	}
```
## Inheritance

In mijn game heb ik een aparte Highscore.ts en Score.ts. De Score class extend de highscore class. Dit heb ik gedaan omdat het gehele resultaat van de score.ts 
uiteindelijk opgeslagen en verwerkt gaat worden in highscore.ts. In de Score class wil ik ook toegang hebben tot de \_highScoreList variable daarom 
is die ook protected gemaakt.<br><br>
Hieronder stukjes code van Score.ts en Highscore.ts
```
class Score extends Highscore {

	private scoreElem:HTMLElement
	private scoreCounter:number = 0
	private player:Player

	constructor(player:Player) {
		super()

		this.player = player

		this.scoreElem = document.createElement('score')
		document.body.appendChild(this.scoreElem)

		this.scoreElem.innerHTML = "Score: "
	}

	public update=()=> {

		// alleen uitvoeren als die niet dood is
		if (this.player.isAlive === true) {
			this.scoreCounter ++
			this.scoreElem.innerHTML = "Score: " + this.scoreCounter
		}
	}

	public get getScore():number {
		return this.scoreCounter
	}

	public get highScoreList():any {
		return this._highScoreList
	}
}

class Highscore {

	protected _highScoreList:any;

	constructor() {

		this._highScoreList = this.getCookie('highscore')

		if (this._highScoreList === null) {
			this.setCookie('highscore', [1203,1234,1238], 300)
		}

		this._highScoreList = this.getCookie('highscore').split(',')
	}

	setCookie(name:string, value:Array<number>, days:number) {
	    var expires = "";
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days*24*60*60*1000));
	        expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	}

	protected getCookie(name:string):any {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	}
}
```

# Klassendiagram

![klassen-diagram](https://raw.githubusercontent.com/branksz/game/master/docs/images/klassendiagram.jpg)


# Peer reviews
### PeerReview van Jasper https://github.com/jaspervriends/CMTTHE04-Eindopdracht

- [x] De code van het individuele project staat op GitHub.
- [x] De game is online speelbaar.
- [x] De game bevat minimaal één van de onderstaande extra uitdagingen.
- [x] De game heeft een startscherm en een eindscherm.
- [x] Er zijn geen bugs.
- [x] Het project maakt gebruik van deze OOP principes.
    - [x] Classes
    - [x] Encapsulation
    - [x] Composition
    - [x] Inheritance
- [ ] De GitHub pagina bevat een ReadMe bestand. Dit bestand bevat:
    - [ ] Per bovengenoemd OOP principe een uitleg: waar is het toegepast, en waarom is het
        op die plek toegepast. De uitleg is inclusief code voorbeelden.
    - [ ] Een klassendiagram van de game.
    - [ ] Een link naar de peer review die in week 6 is gedaan

### Extra opdrachten 

- [x] De game ziet er zeer verzorgd uit dankzij goed uitgewerkt UI design en artwork.
- [ ] De game bevat een hiscore lijst. Scores worden bewaard nadat de game is afgesloten.
- [ ] De game werkt met Canvas in plaats van DOM elementen
- [ ] De game bevat local of online multiplayer.
- [ ] De game werkt op mobiele schermen en ondersteunt touchscreen controls.
- [ ] De game maakt gebruik van device api's zoals de camera, microfoon, gyroscoop of GPS.
- [ ] De game gebruikt een externe library uit de lijst in deze modulewijzer. 

## Feedback
Jasper zijn game ziet er erg mooi uit, door de assets die hij heeft gebruikt ziet het er erg professioneel uit. 
Hij moet alleen nog even werken aan de github readme en uitleg voor de rest is de game perfect. 
Het feit dat er ook geluid in zit maakt het vele malen leuker