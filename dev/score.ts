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