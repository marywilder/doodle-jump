document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let isGameOver = false
    let doodlerLeftSpace = 6.25
    let score = 0
    let startPoint = 18.75
    let doodlerBottomSpace = startPoint
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
   
    let playButton = document.getElementById("playbutton")
    let introPage = document.querySelector(".intro")
    let playAgain = document.querySelector(".play-again-button")
    let avatarSection = document.querySelector(".avatar-section")
    //platforms.classList.add("platforms")
    //score.classList.add('score')

    //creates platforms

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 39.376
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'rem'
            visual.style.bottom = this.bottom + 'rem'
            grid.appendChild(visual)

        }
    }
    
    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 75 / platformCount
            let newPlatBottom = 12.5 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            
        }
    }

    //platforms moving down as doodle jumps

    function movePlatforms() {
        if (doodlerBottomSpace > 25) {
            platforms.forEach(platform => {
                platform.bottom -= 0.50
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'rem'

                if (platform.bottom < 1.25) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(75)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    //doodler created and placed on grid

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'rem'
        doodler.style.bottom = doodlerBottomSpace + 'rem'
    }

    //doodler falling

    function fall() {
        clearInterval(upTimerId)
        
        isJumping = false
        downTimerId = setInterval(function () {
           doodlerBottomSpace -= 0.626
           doodler.style.bottom = doodlerBottomSpace + 'rem' 
           if (doodlerBottomSpace <= 0) {
            gameOver()
           }

           platforms.forEach(platform => {
            if (
                (doodlerBottomSpace >= platform.bottom) &&
                (doodlerBottomSpace <= platform.bottom + 1.876) &&
                ((doodlerLeftSpace + 7.5 >= platform.left) && (doodlerLeftSpace <= platform.left + 10.626)) && 
                !isJumping
            ) {
                console.log('landed')
                startPoint = doodlerBottomSpace
                jump()
            }
           })
        }, 20)
    }

   //doodler jumping

   function jump() {
    clearInterval(downTimerId)
    
    isJumping = true
    upTimerId = setInterval(function () {
        console.log(startPoint)
    console.log('1', doodlerBottomSpace)
        doodlerBottomSpace += 2.5
        doodler.style.bottom = doodlerBottomSpace + 'rem'
        if (doodlerBottomSpace > startPoint + 25) {
            fall()
            isJumping = false
        }
    },30)

   
}

function moveLeft() {
    if (isGoingRight) {
        clearInterval(rightTimerId)
        isGoingRight = false
    }

    isGoingLeft = true
    leftTimerId = setInterval(function () {
       if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 0.626
        doodler.style.left = doodlerLeftSpace + 'rem'
       } else moveRight()
       
        
    }, 20)
    
}

function moveRight() {
    if (isGoingLeft) {
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(function() {
        if (doodlerLeftSpace <= 39.126) {
            doodlerLeftSpace += 0.626
            doodler.style.left = doodlerLeftSpace + 'rem'
        } else moveLeft()
    }, 20)
    
}

    

 

    

    

     function moveStraight() {
        isGoingRight = false
        isGoingLeft = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

     //controls section

    function control(e) {
        if (e.key === "ArrowRight") {
            doodler.style.bottom = doodlerBottomSpace + 'rem'
            moveRight()
        } else if (e.key === "ArrowLeft") {
            
            moveLeft()
        } else if (e.key === "ArrowUp") {
            moveStraight()
        }
    }

    //game over

    function gameOver() {
        console.log('game over')
        isGameOver = true

        while(grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = `<h2 class="game-over">game oveR !</h2><h3 class="score">youR scoRe: ${score} !<h3>`
        grid.appendChild(playAgain)
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
     }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump(startPoint)
            document.addEventListener('keyup', control)

        }
    }
    //begin game
    function playGame() {   
        
        
        document.getElementById("playbutton").addEventListener('click', start)
        grid.removeChild(playAgain)
        
    }


    
    
    
    //removes front page
    function removeButton() {
        grid.removeChild(playButton)
        grid.removeChild(introPage)
        grid.removeChild(avatarSection)

    }
    playGame()
    
   playButton.addEventListener('click', removeButton)

    //end of play game section



    //choose your avatar section
    let floof = document.querySelector('.floof')
    let doodleguy = document.querySelector('.original-doodle')
    let jelly = document.querySelector('.jelly')

    let floofSrc = floof.getAttribute("src")
    doodleguy.addEventListener("click", chooseAvatar)
    let jellySrc = jelly.getAttribute("src")
    let doodleguySrc = doodleguy.getAttribute("src")
    
    floof.addEventListener("click", chooseAvatar)

    jelly.addEventListener("click", chooseAvatar)


    //changes avatar
    function chooseAvatar(e) {
        if (e.target === doodleguy) {
            doodler.style.backgroundImage = `url(${doodleguySrc})`
            
            
        } else if (e.target === floof) {
            doodler.style.backgroundImage = `url(${floofSrc})`
            doodler.style.width = '12.5rem'
        } else if (e.target === jelly) {
            doodler.style.backgroundImage= `url(${jellySrc})`
        }
    }
    

    //playAgain.addEventListener('click', playGame())
    //let welcomePage = document.querySelector(".welcome-page")
    let playButtonTwo = document.createElement("button")
    playButtonTwo.classList.add('playbutton')
    playButtonTwo.innerHTML = "let's play!"
    
    
    function goToHome() { 
            grid.innerHTML=""   
            grid.appendChild(introPage)
            grid.appendChild(avatarSection)
            //grid.removeChild(playAgain)
            grid.appendChild(playButtonTwo)
            
            }


    function restartGame() {
        grid.removeChild(playButtonTwo)
                platforms = []
                createPlatforms()
                createDoodler()
                jump()
                document.addEventListener('keyup', control)
                score = 0
                grid.removeChild(introPage)
                grid.removeChild(avatarSection)
                grid.removeChild(playAgain)
                grid.removeChild(playButtonTwo)
                
            }
    playAgain.addEventListener('click', goToHome) 

    playButtonTwo.addEventListener('click', restartGame)
        
            
    //score.classList.add('score')      
        
    })

