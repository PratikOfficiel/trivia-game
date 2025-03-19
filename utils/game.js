const {getAllPlayers} = require('../utils/player.js');

const game = {
    prompt:{
        question:"",
        answers: "",
        createdAt: "",
    },
    status: {
        submissions: {},
        correctAnswer :"",
        isRoundOver :false
    }
}

const getGameStatus = ({event}) => {
    const {correctAnswer, isRoundOver} = game.status;

    if (event==="getAnswer" && isRoundOver) {
        return {correctAnswer}
    }
}

const setGameStatus = ({event, playerId, answer, room}) => {
    if (event==="sendAnswer") {
        
        const {submissions} = game.status;

        if (!submissions[`${playerId}`]){
            submissions[`${playerId}`]= answer
        }

        game.status.isRoundOver = Object.keys(submissions).length===getAllPlayers(room).length;
    }

    return game.status
}

const setGame = async() => {

    try {
        const response = await fetch('https://opentdb.com/api.php?amount=1&category=18');
        const data = await response.json();

        console.log(data);
        const {
            question,
            correct_answer,
            incorrect_answers,
        } = data.results[0];

        game.status.submissions = {};
        game.status.correctAnswer = correct_answer;
        game.prompt = {
            createdAt: new Date().getTime(),
            question,
            answers: shuffle([correct_answer,...incorrect_answers])
        }

        console.log(game);

    } catch (error) {
        console.log(error);
    }
    return game;
}

const shuffle = (array) => {
    for (let end = array.length-1;end>0;end--){
        const randomIdx = Math.floor(Math.random()*(end+1));
        [array[end],array[randomIdx]] = [array[randomIdx],array[end]];
    }

    return array;
}

module.exports = {
    setGame,
    setGameStatus,
    getGameStatus
}