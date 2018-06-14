class Block {

	private blockElemArray:Array<HTMLElement> = []
	private xpos:Array<number> = []
	private allBlocks:number = Math.ceil(window.innerWidth / 1000)
	private player:Player

	constructor(player:Player) {

		this.player = player;

		// Blocks aanmaken
		for (let i:number = 0; i < this.allBlocks; i++) {

			let tmpBlock = document.createElement('block')
			document.body.appendChild(tmpBlock)

			this.blockElemArray.push(tmpBlock)

			// Array met start pos van verschillende blocks
			this.xpos[i] = i * 600
		}
	}

	update() {

		// Loopen door de blocks en verschuiven
		for (let i:number = 0; i < this.allBlocks; i++) {
			this.xpos[i] = this.xpos[i] + 5

			this.blockElemArray[i].style.right = this.xpos[i] + 'px';

			/* Check collision met de player */
			let tmpPlayer = this.player.getPlayerElem().getBoundingClientRect()
			let tmpBlock = this.blockElemArray[i].getBoundingClientRect()

			// Elke x punten breder maken
			if (this.player.score.getScore % 500 == 0) {
				let tmpWidth = tmpBlock.width * 1.2

				if (tmpWidth > 150) {
					tmpWidth = 150
				}

				this.blockElemArray[i].style.width = tmpWidth + 'px';
			}

			/* Als de player overlapt met het block, 
			 op basis van breedte en hoogte en positie */
			if (!(tmpPlayer.right < tmpBlock.left || 
	              tmpPlayer.left > tmpBlock.right || 
	              tmpPlayer.bottom < tmpBlock.top || 
	              tmpPlayer.top > tmpBlock.bottom)) {
				// Player is geraakt
				this.player.die()
			}

			// Als die buiten beeld komt
			if (this.xpos[i] >= window.innerWidth) {
				// zet weer rechts
				this.xpos[i] = 0

				// random ypos waarde
				this.blockElemArray[i].style.bottom = Math.floor(Math.random() * (40 - 0 + 1)) + 0 + '%'
			}
		}
	}
}