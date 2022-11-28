import { getTimeInUserFormat } from "./utils.js";

export class CustomPlayer {
  constructor(parentElement, props) {

    // переменные состояния
    this.isChangingTime = false;

    // audio
    this.audio = new Audio();
    this.audio.addEventListener("ended", () => this.ended());
    this.audio.addEventListener("loadedmetadata", () => this.loadedmetadata());

    // *** DOM elements +
    let wrapperElement = document.createElement("div");
    wrapperElement.classList = "player";

    // Кнопка Play/Pause
    let playBtnElement = document.createElement("button");
    playBtnElement.classList = "player__play-btn";
    playBtnElement.addEventListener("click", async () => this.play());

    // тек. позиция / длительность цифрами
    let timeInfoElement = document.createElement("div");
    timeInfoElement.classList = "player__time-info-" + props.size;
    timeInfoElement.innerHTML = "00:00 / 00:00";

    // ползунок трека
    let timeBarElement = document.createElement("input");
    timeBarElement.type = "range";
    timeBarElement.min = 0;
    timeBarElement.value = 0;
    timeBarElement.max = this.audio.duration;
    timeBarElement.classList = "player__time-bar-" + props.size;
    timeBarElement.addEventListener("input", () => this.changeCurrentTime());
    timeBarElement.addEventListener("change", () => this.isChangingTime = false);

    // уровень звука
    let volumeElement = document.createElement("input");
    volumeElement.type = "range";
    volumeElement.min = 0;
    volumeElement.max = 100;
    volumeElement.value = 100;
    volumeElement.classList = "player__volume-" + props.size;
    volumeElement.addEventListener("input", () => this.changeVolume());

    wrapperElement.append(playBtnElement, timeBarElement, timeInfoElement, volumeElement);
    parentElement.append(wrapperElement);
    // ************* DOM elements -

    this.playBtnElement = playBtnElement;
    this.timeBarElement = timeBarElement;
    this.timeInfoElement = timeInfoElement;
    this.volumeElement = volumeElement;
  }

  // визуализация
  renderTime() {
    let currentTime = Math.round(this.audio.currentTime);
    let duration = Math.round(this.audio.duration);
    this.timeInfoElement.innerHTML = `${getTimeInUserFormat(currentTime)} / ${getTimeInUserFormat(duration)}`;
    if (!this.isChangingTime) {
      this.timeBarElement.value = currentTime;
     }
  }

  // хендлеры
  async play() {
    if (this.audio.paused) { 
      await this.audio.play();
      this.renderTime();
      this.renderTimeUpdater = setInterval(() => this.renderTime(), 10);

      this.playBtnElement.classList.add("player_playing");
    } else {
      this.audio.pause();
      clearInterval(this.renderTimeUpdater);
      this.playBtnElement.classList.remove("player_playing");
    }
  }

  pause() {
    if (!this.audio.paused) { 
      this.audio.pause();
      clearInterval(this.renderTimeUpdater);
      this.playBtnElement.classList.remove("player_playing");
    }
  }
  
  setToStartPosition() {    
    clearInterval(this.renderTimeUpdater);
    this.audio.currentTime = 0;
    this.renderTime();
    this.playBtnElement.classList.remove("player_playing");   
  }

  changeVolume() {
    this.audio.volume = this.volumeElement.value / 100;
  }
  
  changeCurrentTime() {
    this.isChangingTime = true;
    this.audio.currentTime = this.timeBarElement.value;
    this.renderTime();
  }

  ended() {    
    this.setToStartPosition();    
  }

  loadedmetadata() {    
    this.setToStartPosition();
    this.timeBarElement.max = Math.round(this.audio.duration);    
  }

  changeTrack(src) {
    this.audio.src = src;
  }
}
