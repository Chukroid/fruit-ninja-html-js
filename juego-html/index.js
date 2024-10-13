const fruitContainer = document.getElementsByClassName("fruit-container")[0]
const pointsgotten = document.getElementsByClassName("pointsgotten")[0]
const playbutton = document.getElementsByClassName("playbutton")[0]
const homescreen = document.getElementsByClassName("homescreen")[0]
let contador = null

let puntos = 0
const spawndelay = 1
let gameActive = false

const fruits = {
    banana: {
        Points: 20,
        IconUrl: "images/fruits/bananaicon.png"
    },
    cherry: {
        Points: 10,
        IconUrl: "images/fruits/cherryicon.png"
    },
    strawberry: {
        Points: 10,
        IconUrl: "images/fruits/strawberryicon.png"
    },
    watermelon: {
        Points: 40,
        IconUrl: "images/fruits/watermelonicon.png"
    },
    
    bomb: {
        Points: 0,
        IconUrl: "images/bombicon.png"
    }
}

// UTILITY FUNCTIONS
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// GAME FUNCTIONS
function getRandomFruit(){
    const keys = Object.keys(fruits)
    const randomIndex = Math.floor(Math.random() * keys.length)
    return [fruits[keys[randomIndex]],keys[randomIndex]=="bomb"]
}
async function createRandomFruit(){
    const fruit = document.createElement("img")
    fruit.className = "fruit"

    const [randomfruit,isbomb] = getRandomFruit()
    fruit.src = randomfruit.IconUrl

    if (isbomb){
        fruit.setAttribute("IsBomb",true)
        fruit.classList.add("fruit-bomb")
    }

    const x = Math.random() * 70
    const y = 100
    const rotate = 360
    let dir = Math.random()

    if (dir > 0.5){
        dir = 20
    }else{
        dir = -20
    }

    fruit.style.transform = `translateX(${x}vw) translateY(${y}vh)`
    fruitContainer.appendChild(fruit)

    setTimeout(() => {
        fruit.style.transform = `translateX(${x+dir}vw) translateY(${Math.random() * (50 - 10) + 10}vh) rotate(${rotate}deg)`
        setTimeout(() => {
            fruit.classList.add("fruit-falling")
            fruit.style.transform = `translateX(${x+dir+((dir*3/100)*10)}vw) translateY(${100}vh) rotate(${rotate / 1.4}deg)`
        }, 550);
        setTimeout(() => {
            fruit.remove()
        }, 1100);
    }, 100);

    fruit.addEventListener('mouseover', function (event) {
        if (fruit.getAttribute("Tagged") || !gameActive){
            return
        }else{
            fruit.classList.remove("fruit-falling")
            fruit.classList.add("fruit-tagged")
            setTimeout(() => {
                fruit.setAttribute("Tagged",true)
                const currentpos = fruit.getBoundingClientRect()
                fruit.style.transform = `translateX(${currentpos.x}px) translateY(${currentpos.y}px) scale(2)`
                fruit.style.opacity = 0
                createSplash(currentpos.x,currentpos.y,isbomb)
                if (isbomb){
                    gameActive = false
                    endgame()
                }else{
                    puntos += randomfruit.Points
                }
            }, 100);
        }
        updatepuntos()
    });
}
function createSplash(x,y,isbomb){
    const splash = document.createElement("img")
    splash.style.transform = `translateX(${x}px) translateY(${y}px)`

    if (isbomb){
        splash.className = "fruit-splash"
        splash.src = "images/explosion.png"
    }else{
        splash.className = "fruit-splash"
        splash.src = "images/splash.png"
    }

    fruitContainer.appendChild(splash)
    setTimeout(() => {
        splash.remove()
    }, 1000);
}
function showdeath(){
    const skull = document.createElement("img")
    skull.className = "dead-icon"
    skull.src = "images/deadicon.png"

    fruitContainer.appendChild(skull)
    setTimeout(() => {
        skull.remove()
    }, 3000);
}

function updatepuntos(){
    if (contador == null){
        contador = document.getElementsByClassName("contador")[0]

        if (contador){
            contador = contador.getElementsByTagName('center')[0]
        }else{
            return
        }

        if (contador.getElementsByTagName('p')[0]) {
            contador = contador.getElementsByTagName('p')[0]
        }else{
            return
        }

        if (!contador){
            return
        }
    }

    contador.innerHTML = `Punto Total: ${puntos}`
}
async function startGame() {
    gameActive = true
    puntos = 0
    updatepuntos()
    fruitContainer.style.display = "block"
    homescreen.style.display = "none"
    contador.style.display = "block"
    while (gameActive){
        createRandomFruit()
        await wait(Math.random() * (spawndelay*1000))
    }
}
async function endgame() {
    showdeath()
    pointsgotten.innerHTML = `CONSEQUISTE ${puntos} puntos!`
    await wait(3000)
    fruitContainer.style.display = "none"
    homescreen.style.display = "flex"
    contador.style.display = "none"
    pointsgotten.style.display = "block"
}

updatepuntos()
contador.style.display = "none"
pointsgotten.style.display = "none"
fruitContainer.style.display = "none"
playbutton.addEventListener('click', function (event) {
    if (!gameActive){
        startGame()
    }
});