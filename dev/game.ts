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