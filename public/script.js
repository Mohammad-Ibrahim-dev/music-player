let currentSong = new Audio();
let songslist;
let currFolder;
let songplayele;
let nextSong;
let preSong;
let arr = [];
let previousplay;

let songinfo = document.querySelector(".song-info")
let playMain = document.querySelector("#playMain")
let searchBtn = document.querySelector(".searchBtn")
let searchBar = document.querySelector("#searchBar")

function search() {
    let yoursSearch = searchBar.value.toUpperCase()
    for (let i = 0; i <= arr.length; i++) {
        let find = arr[i].querySelector(".info").firstElementChild.innerHTML.toUpperCase();
        if (find.indexOf(yoursSearch) > -1) {
            arr[i].style.display = ""
        }
        else {
            arr[i].style.display = "none"
        }
    }
}
// this function for mobile view menubar
let menuFlag = false;
function menuBar() {
    let left = document.querySelector('.left')
    let right= document.querySelector('.right')
    if (menuFlag == false) {
        left.style.width = "94%"
        right.style.left="105%"
        menuFlag = true
    }
    else {
        left.style.width = "0%"
        right.style.left="0%"
        menuFlag = false
    }
}
// function to change miniseconds to seconds and minute
function secToMinSec(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
        return "00:00"; // Return "00:00" for invalid inputs
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
// function to playmusic,and store next ,previous song
async function playMusic(gaana, element) {
    currentSong.src = `/songs/${currFolder}/${gaana.replaceAll(' ', '_')}`
    currentSong.play();
    element.lastElementChild.src = "assets/pauseBtn.svg"
    playMain.src = "assets/pauseBtn.svg"
    songplayele = element
    let indx = arr.indexOf(element)
    nextSong = arr[indx + 1]
    preSong = arr[indx - 1]
    songinfo.innerHTML = `<img src="/assets/images/${currFolder}.jpeg "alt="${currFolder} album">
                          <div>
                          <h3 class="folderName">${currFolder}</h3>
                          <p>${gaana.replaceAll('_', ' ')}</p>
                          </div>`
}
// function to get all the songs from the folder 
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/songs/${folder}`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    songslist = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith(".mp3")) {
            songslist.push(element.innerHTML)
        }
    }

    // Show all the songs in your playlist
    let songs = document.querySelector(".songframe")
    songs.innerHTML = ""
    for (const song of songslist) {
        let div = document.createElement("div")
        div.innerHTML = `<img src="assets/music-note-04-stroke-rounded.svg" alt="">
              <div class="info">
              <h4>${song.replaceAll('_', ' ')}</h4>
              <p>Artist</p>
              </div>
              <img class="play" src="assets/playBtn.svg" alt=""> `
        div.classList.add("list");
        songs.appendChild(div);
    }
    // play,pause change songs from song list
    arr = Array.from(document.querySelectorAll(".list"))
    arr.forEach(ele => {
        ele.addEventListener("click", () => {
            if (currentSong.src == "") {
                playMusic(ele.querySelector(".info").firstElementChild.innerHTML, ele)
            }
            else if (ele == songplayele) {
                if (currentSong.paused) {
                    currentSong.play()
                    ele.lastElementChild.src = "assets/pauseBtn.svg"
                    playMain.src = "assets/pauseBtn.svg"
                }
                else {
                    currentSong.pause()
                    ele.lastElementChild.src = "assets/playBtn.svg"
                    playMain.src = "assets/playBtn.svg"
                }
            }
            else {
                songplayele.lastElementChild.src = "assets/playBtn.svg"
                playMusic(ele.querySelector(".info").firstElementChild.innerHTML, ele)
            }
        })
    })

}
// function to add Album of the playist
async function displayAlbum() {
    let readFolder = await fetch(`/songs`)
    let response = await readFolder.text()
    let div =document.createElement('div')
    div.innerHTML=response
    let playcard=div.querySelectorAll("a")
    let cardContainer=document.querySelector('.card-container')
    for(let i=1 ;i < playcard.length ;i++){
        let div=document.createElement('div')
        div.classList.add('card')
        div.innerHTML=` <img src="assets/images/${playcard[i].innerHTML.replace('/','')}.jpeg" alt="${playcard[i].innerHTML.replace('/','')}">
                         <div>
                             <h3 class="folderName" >${playcard[i].innerHTML.replace('/','')}</h3>
                             <p>This is ${playcard[i].innerHTML.replace('/','')}. The essential tracks, all in one playlist!</p>
                        </div>`
        cardContainer.appendChild(div)
    }
    currFolder=`${playcard[1].innerHTML.replace('/','')}`
    await getSongs(currFolder)
    // playMusic(arr[0].querySelector(".info").firstElementChild.innerHTML, arr[0])
    // currentSong.pause();
    arr[0].lastElementChild.src = "assets/playBtn.svg"
    playMain.src = "assets/playBtn.svg"
}
// main functin working start from here
async function main() {
     await displayAlbum()
     let card = document.querySelectorAll(".card")
     card.forEach(e => {
         e.addEventListener("click", async () => {
             let playlist_name = e.querySelector(".folderName").innerHTML;
             await getSongs(playlist_name);
         })
     })

    // play pause button working
    playMain.addEventListener("click", () => {
        if (currentSong.src == "") { }
        else {
            if (currentSong.paused) {
                currentSong.play();
                playMain.src = "assets/pauseBtn.svg"
                songplayele.lastElementChild.src = "assets/pauseBtn.svg"
            }
            else {
                currentSong.pause();
                playMain.src = "assets/playBtn.svg"
                songplayele.lastElementChild.src = "assets/playBtn.svg"
            }
        }
    })

    // next and previous button
    let next = document.querySelector("#next")
    next.addEventListener("click", () => {
        playMusic(nextSong.querySelector(".info").firstElementChild.innerHTML, nextSong)
        preSong.lastElementChild.src = "assets/playBtn.svg"
    })
    let previous = document.querySelector("#pre")
    previous.addEventListener("click", () => {
        playMusic(preSong.querySelector(".info").firstElementChild.innerHTML, preSong)
        nextSong.lastElementChild.src = "assets/playBtn.svg"
    })

    // setting the song time and duration
    let seek = document.querySelector("#seekbar")
    let songTime = document.querySelector("#timebox");
    currentSong.addEventListener("timeupdate", () => {
        if (currentSong.duration == currentSong.currentTime) {
            playMain.src = "assets/playBtn.svg"
            songplayele.lastElementChild.src = "assets/playBtn.svg"
            playMusic(nextSong.querySelector(".info").firstElementChild.innerHTML, nextSong)
        }
        songTime.firstElementChild.innerHTML = secToMinSec(currentSong.currentTime)
        songTime.lastElementChild.innerHTML = secToMinSec(currentSong.duration)
        seek.max = currentSong.duration
        seek.value = currentSong.currentTime
    })
    // seekbar working
    seek.oninput = (() => {
        songTime.firstElementChild.innerHTML = secToMinSec(currentSong.currentTime = seek.value)
    })


    // volume bar 
    let volume = document.querySelector("#volume")
    volume.oninput = (() => {
        currentSong.volume = volume.value
        volume.nextElementSibling.innerText = `${(volume.value) * 100}%`
    })
    let flag = false;
    searchBtn.addEventListener('click', () => {
        if (flag == false) {
            searchBar.style.display = "block"
            flag = true
        }
        else {
            searchBar.style.display = "none"
            flag = false
        }
    })
}

main()