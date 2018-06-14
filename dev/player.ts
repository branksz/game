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

	public fallDown=()=> {

		/* Als je de spatie los laat 
		 vallen naar beneden */
		this.isFalling = true
	}

	// De player html data ophalen
	public getPlayerElem=()=> {

		return this.playerElem
	}

	// aanroepen om te kijken of de player leeft
	public get isAlive():boolean {
		return this.isDead ? false : true
	}

	// Dood functie aanroepen van de player
	public die() {

		if (this.isDead === false) {
			this.playerElem = document.createElement('dead')
	        document.body.appendChild(this.playerElem)

			this.playerElem.style.bottom = this.jumpSpeed + 'px'

	        this.isDead = true

	        // opacity toevoegen
	        let opacityObject = document.createElement('opacity')
	        document.body.appendChild(opacityObject)

	        // restart button toevoegen
	        let tmpRestart = document.createElement('restart')
	        document.body.appendChild(tmpRestart)

	        tmpRestart.innerHTML = "Restart Game"
	        tmpRestart.style.zIndex = "999"

	        // score in het midden zetten
	        let endScore = document.createElement('endscore')
	        document.body.appendChild(endScore)

	        endScore.innerHTML = "Score: " + this.score.getScore

	        // remove score
	        document.body

	        // eventlistener toevoegen
	        tmpRestart.addEventListener('click', function(){
	        	location.reload();
	        });
		}
	}
}