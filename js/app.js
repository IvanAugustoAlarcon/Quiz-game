const _question = document.getElementById('question')
const _options = document.querySelector('.quiz-options')
const _checkBtn = document.getElementById('check-answer')
const _playAgainBtn = document.getElementById('play-again')
const _nextBtn = document.getElementById('next-question')
const _result = document.getElementById('result')
const _correctScore = document.getElementById('correct-score')
const _totalQuestion = document.getElementById('total-question')

let correctAnswer = "", correctScore=0, askedCount = 0, totalQuestion = 10

// load question from API
const loadQuestion = async () =>{
    const APIUrl = 'https://opentdb.com/api.php?amount=1'
    const result = await fetch(`${APIUrl}`)
    const data = await result.json()
    _result.innerHTML = ""
    showQuestion(data.results[0])
    _nextBtn.disabled = true
}

// event listeners
const eventListeners= () =>{
    _checkBtn.addEventListener('click', checkAnswer)
    _playAgainBtn.addEventListener('click', restartQuiz)
    _nextBtn.addEventListener('click', nextQuestion)
}

document.addEventListener('DOMContentLoaded', () =>{
    loadQuestion()
    eventListeners()
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
})


// display question and options
const showQuestion = (data) =>{
    _checkBtn.disabled = false
    correctAnswer = data.correct_answer
    let incorrectAnswer = data.incorrect_answers
    let optionsList = incorrectAnswer
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer)
     console.log(correctAnswer)

    
    _question.innerHTML = `${data.question}`
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `
    selectOption()
}


// options selection
const selectOption = () =>{
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected')
                activeOption.classList.remove('selected')
            }
            option.classList.add('selected');
        })
    })
}

// answer checking
const checkAnswer = () =>{
    _checkBtn.disabled = true
    _nextBtn.disabled = false
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++
            _result.innerHTML = `<p>Correct Answer!</p>`
        } else {
            _result.innerHTML = `<p>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`
        }
    } else {
        _result.innerHTML = `<p>Please select an option!</p>`
        _checkBtn.disabled = false
    }
}

// to convert html entities into normal text of correct answer if there is any
const HTMLDecode = (textString) =>{
    let doc = new DOMParser().parseFromString(textString, "text/html")
    return doc.documentElement.textContent
}

const nextQuestion = () =>{
    askedCount++
    setCount()
    if(askedCount == totalQuestion){
        _question.innerHTML =''
        _options.innerHTML =''

        _result.innerHTML = `<p>Your score is ${correctScore}.</p>`
        _playAgainBtn.style.display = "block"
        _checkBtn.style.display = "none"
        _nextBtn.style.display = "none"
    } else {
            loadQuestion()
    }
}

const setCount = () =>{
    _totalQuestion.textContent = totalQuestion
    _correctScore.textContent = correctScore
}


const restartQuiz = () =>{
    correctScore = askedCount = 0
    _playAgainBtn.style.display = "none"
    _checkBtn.style.display = "block"
    _nextBtn.style.display = "block"
    _checkBtn.disabled = false
    _nextBtn.disabled = true
    setCount()
    loadQuestion()
}