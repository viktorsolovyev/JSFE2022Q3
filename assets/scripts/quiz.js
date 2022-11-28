import { CustomPlayer } from "./player.js";
import { birdsCategories, birdsData } from "./birds.js";
import { birdsCategoriesEn, birdsDataEn } from "./birds-en.js";
import { getRandomIntInclusive } from "./utils.js";
import { LANG } from "./main.js";

export class Quiz {
  constructor(parentElement) {
    // language
    if (LANG == "ru") {
      this.birdsData = birdsData;
      this.birdsCategories = birdsCategories;
    } else if (LANG == "en") {
      this.birdsData = birdsDataEn;
      this.birdsCategories = birdsCategoriesEn;
    }

    // состояние
    this.quantityStages = this.birdsCategories.length;
    this.maxPoints = this.quantityStages * 5;
    this.#initStage(1);

    // *** DOM elements +
    let wrapperElement = document.createElement("div");
    wrapperElement.classList = "quiz";

    let scoreElement = document.createElement("div");
    scoreElement.classList = "quiz__score";
    scoreElement.innerText = "Счёт: 0";

    let stagesElement = document.createElement("div");
    stagesElement.classList = "quiz__stages quiz-basic";

    this.birdsCategories.forEach((elem) => {
      let stageElement = document.createElement("div");
      stageElement.innerText = elem.name;
      this[`stageElement${elem.id}`] = stageElement;
      stageElement.classList = "quiz__stage";
      if (elem.id == 1) stageElement.classList.add("quiz__stage_current");
      stagesElement.append(stageElement);
    });

    let resultsElement = document.createElement("div");
    resultsElement.classList = "quiz__results quiz-basic invisible";

    let congratHeadElement = document.createElement("div");
    congratHeadElement.classList = "quiz__congrat-head";
    congratHeadElement.innerText = "Поздравляем!";

    let congratBodyElement = document.createElement("div");
    congratBodyElement.classList = "quiz__congrat-body";

    let tryAgainElement = document.createElement("div");
    tryAgainElement.innerText = "Попробовать еще раз!";
    tryAgainElement.classList = "quiz__try-again-btn quiz-basic quiz__right-answer";
    tryAgainElement.addEventListener("click", () => this.newGame());

    resultsElement.append(congratHeadElement, congratBodyElement, tryAgainElement);

    let questionElement = document.createElement("div");
    questionElement.classList = "quiz__question quiz-basic";

    let questionBirdImageElement = document.createElement("img");
    questionBirdImageElement.classList = "quiz__bird-image";
    questionBirdImageElement.src = "assets/images/fake-bird.jpg";

    let questionRightPartElement = document.createElement("div");
    questionRightPartElement.classList = "quiz__question__right-part";

    let questionBirdNameElement = document.createElement("div");
    questionBirdNameElement.innerText = "************";
    questionBirdNameElement.classList = "quiz__question__bird-name";

    let questionBirdSoundElement = document.createElement("div");
    questionBirdSoundElement.classList = "quiz__question__bird-sound";

    questionRightPartElement.append(
      questionBirdNameElement,
      questionBirdSoundElement
    );

    questionElement.append(questionBirdImageElement, questionRightPartElement);

    let answersWrapperElement = document.createElement("div");
    answersWrapperElement.classList = "quiz__answers-wrapper";

    let answersElement = document.createElement("div");
    answersElement.classList = "quiz__answers quiz-basic";

    let answerInfoElement = document.createElement("div");
    answerInfoElement.classList = "quiz__answer-info quiz-basic";

    this.birdsData[this.stage - 1].forEach((elem) => {
      let answerElement = document.createElement("div");
      answerElement.innerText = elem.name;
      answerElement.id = `answer${elem.id}`;
      answerElement.classList = "quiz__answer";
      this[`answerElement${elem.id}`] = answerElement;
      answerElement.addEventListener("click", (e) => this.checkAnswer(e));
      answersElement.append(answerElement);
    });

    let nextElement = document.createElement("div");
    nextElement.innerText = "Дальше";
    nextElement.classList = "quiz__next-btn quiz-basic";
    nextElement.addEventListener("click", () => this.changeStage());

    let answerInfoTopElement = document.createElement("div");
    answerInfoTopElement.classList = "quiz__answer-top";

    let answerInfoDescriptionElement = document.createElement("div");
    answerInfoDescriptionElement.classList = "quiz__answer-description";

    let answerBirdImageElement = document.createElement("img");
    answerBirdImageElement.classList = "quiz__bird-image";

    let answerTopRightElement = document.createElement("div");
    answerTopRightElement.classList = "quiz__answer__top-right";

    let answerBirdNameElement = document.createElement("div");
    answerBirdNameElement.classList = "quiz__answer__bird-name";

    let answerBirdSpeciesElement = document.createElement("div");
    answerBirdSpeciesElement.classList = "quiz__answer__bird-species";

    let answerBirdSoundElement = document.createElement("div");
    answerBirdSoundElement.classList = "quiz__answer__bird-sound";

    answerTopRightElement.append(
      answerBirdNameElement,
      answerBirdSpeciesElement,
      answerBirdSoundElement
    );
    answerInfoTopElement.append(answerBirdImageElement, answerTopRightElement);
    answerInfoElement.append(
      answerInfoTopElement,
      answerInfoDescriptionElement
    );
    answersWrapperElement.append(answersElement, answerInfoElement);
    wrapperElement.append(
      scoreElement,
      stagesElement,
      resultsElement,
      questionElement,
      answersWrapperElement,
      nextElement
    );
    parentElement.append(wrapperElement);

    //   // ************* DOM elements -

    this.scoreElement = scoreElement;
    this.questionBirdImageElement = questionBirdImageElement;
    this.questionBirdNameElement = questionBirdNameElement;
    this.answerBirdImageElement = answerBirdImageElement;
    this.answerBirdNameElement = answerBirdNameElement;
    this.answerBirdSpeciesElement = answerBirdSpeciesElement;
    this.answerInfoDescriptionElement = answerInfoDescriptionElement;
    this.answerInfoElement = answerInfoElement;
    this.answerInfoTopElement = answerInfoTopElement;
    this.nextElement = nextElement;
    this.resultsElement = resultsElement;
    this.questionElement = questionElement;
    this.answersWrapperElement = answersWrapperElement;
    this.congratBodyElement = congratBodyElement;

    this.questionPlayer = new CustomPlayer(questionBirdSoundElement, {
      size: "large",
    });
    this.answerPlayer = new CustomPlayer(answerBirdSoundElement, {
      size: "small",
    });

    // this.#toggleVisibleAnswerBirdInfo(true);
    this.#initNewgame();

    // let birdInfo = this.#getBirdInfo(this.stage, this.currentQuestion, LANG);
    // this.questionPlayer.changeTrack(birdInfo.audio);

    // system sounds
    this.soundRightAnswer = new Audio("assets/audio/right-answer.mp3");
    this.soundWrongAnswer = new Audio("assets/audio/wrong-answer.mp3");
  }

  // handlers
  checkAnswer(event) {
    let id = parseInt(event.target.id.replace("answer", ""));
    let birdInfo = this.#getBirdInfo(this.stage, id, LANG);
    this.#loadSelectedBirdInfo(birdInfo);
    this.#toggleVisibleAnswerBirdInfo(false);
    if (this.answeredRight) return;

    if (this.currentQuestion == id) {
      this.soundRightAnswer.play();
      this.answeredRight = true;
      this.questionPlayer.pause();
      this.score += this.points;
      this.scoreElement.innerText = `Счёт: ${this.score}`;
      this.nextElement.classList.add("quiz__right-answer");
      this[`answerElement${id}`].classList.add("quiz__right-answer");
      this.#showQuestionInfo(birdInfo);
      this.congratBodyElement.innerText = `Вы прошли викторину и набрали ${this.score} из ${this.maxPoints} возможных баллов`;
    } else {
      this.soundWrongAnswer.play();
      this.points -= 1;
      this[`answerElement${id}`].classList.add("quiz__wrong-answer");
    }
  }

  changeStage() {
    if (!this.answeredRight) return;
    if (this.stage == this.quantityStages) {
      this.resultsElement.classList.remove("invisible");
      this.questionElement.classList.add("invisible");
      this.answersWrapperElement.classList.add("invisible");
      this.nextElement.classList.add("invisible");
      this.nextElement.classList.remove("quiz__right-answer");
      return;
    }

    this[`stageElement${this.stage}`].classList.remove("quiz__stage_current");
    this.#initStage(this.stage + 1);
    this.#hideQuestionInfo();
    this.#toggleVisibleAnswerBirdInfo(true);
    let birdInfo = this.#getBirdInfo(this.stage, this.currentQuestion);

    for (let i = 1; i <= this.quantityStages; i++) {
      this[`answerElement${i}`].innerText =
        this.birdsData[this.stage - 1][i - 1].name;
      this[`answerElement${i}`].classList.remove("quiz__right-answer");
      this[`answerElement${i}`].classList.remove("quiz__wrong-answer");
    }

    this.questionPlayer.changeTrack(birdInfo.audio);

    this[`stageElement${this.stage}`].classList.add("quiz__stage_current");
    this.nextElement.classList.remove("quiz__right-answer");
  }

  newGame() {
    this.#initStage(1);
    this.#initNewgame();
  }

  // inside functions
  #initNewgame() {
    this.scoreElement.innerText = `Счёт: ${this.score}`;
    let birdInfo = this.#getBirdInfo(this.stage, this.currentQuestion, LANG);
    this.questionPlayer.changeTrack(birdInfo.audio);
    this.resultsElement.classList.add("invisible");
    this.questionElement.classList.remove("invisible");
    this.answersWrapperElement.classList.remove("invisible");
    this.nextElement.classList.remove("invisible");
    this.stageElement1.classList.add("quiz__stage_current");
    this.#hideQuestionInfo();
    this.#toggleVisibleAnswerBirdInfo(true);
    this[`stageElement${this.quantityStages}`].classList.remove("quiz__stage_current");

    this.birdsData[this.stage - 1].forEach((elem) => {
      this[`answerElement${elem.id}`].innerText = elem.name;
    });

    for (let i = 1; i <= this.quantityStages; i++) {
      this[`answerElement${i}`].innerText =
        this.birdsData[this.stage - 1][i - 1].name;
      this[`answerElement${i}`].classList.remove("quiz__right-answer");
      this[`answerElement${i}`].classList.remove("quiz__wrong-answer");
    }
  }

  #toggleVisibleAnswerBirdInfo(hide = true) {
    if (hide) {
      this.answerInfoElement.prepend(
        document.createTextNode("Послушайте плеер, выберите птицу из списка.")
      );
      this.answerInfoTopElement.classList.add("invisible");
      this.answerInfoDescriptionElement.classList.add("invisible");
    } else {
      if (this.answerInfoElement.childNodes[0].nodeType == 3) {
        this.answerInfoElement.childNodes[0].remove();
      }
      this.answerInfoTopElement.classList.remove("invisible");
      this.answerInfoDescriptionElement.classList.remove("invisible");
    }
  }

  #initStage(stage) {
    if (stage == 1) {
      this.score = 0;
    }
    this.stage = stage;
    this.points = 5;
    this.answeredRight = false;
    this.currentQuestion = getRandomIntInclusive(1, this.quantityStages);
  }

  #loadSelectedBirdInfo(birdInfo) {
    this.answerBirdImageElement.src = birdInfo.image;
    this.answerBirdNameElement.innerText = birdInfo.name;
    this.answerBirdSpeciesElement.innerText = birdInfo.species;
    this.answerInfoDescriptionElement.innerText = birdInfo.description;
    this.answerPlayer.changeTrack(birdInfo.audio);
  }

  #showQuestionInfo(birdInfo) {
    this.questionBirdImageElement.src = birdInfo.image;
    this.questionBirdNameElement.innerText = birdInfo.name;
  }

  #hideQuestionInfo() {
    this.questionBirdImageElement.src = "../../assets/images/fake-bird.jpg";
    this.questionBirdNameElement.innerText = "************";
  }

  #getBirdInfo(group, item) {
    return this.birdsData[group - 1][item - 1];
  }
}
