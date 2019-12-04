const USERS_URL = "http://localhost:3000/users"
const ANSWERS_URL = "http://localhost:3000/answers"
const QUEST_URL = "https://opentdb.com/api.php?amount=3&type=multiple"
const form = document.getElementById('login-form')

// main function
function main() {
  document.addEventListener('DOMContentLoaded', function(){ 
    // render all users & scores in left sidebar
    welcomeMessage()
    getAllUsers()
    
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      let user = grabUserData(e)
      e.target.reset()
      loginUser(user)
    })
  })
}

// user login functions
function loginUser(user) {
    const name = user.username
    const configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: name
      })
    }

    fetch(USERS_URL, configObj)
    .then(resp => resp.json())
    .then(user => renderUserInfo(user))
    startMessage()
    getQuestions()
  }

function grabUserData(e) {
    return {username: e.target.children[1].value} 
  }

function renderUserInfo(user) {
    const infosec = document.querySelector('.user-info')
    infosec.innerHTML = `<span data-id= ${user.id}><p>Name: ${user.username}</p><p id="current-score">${user.score}</p>`
  }

// user ranking functions
function getAllUsers() {
  fetch(USERS_URL)
  .then(resp => resp.json())
  .then(users => renderUsers(users))
}

function renderUsers(users) {
  users.forEach(user => listUser(user))
}

function listUser(user) {
  const userList = document.querySelector('ul')
  const userItem = document.createElement('li')
  userItem.innerText = `${user.username}   ${user.score}`
  userList.appendChild(userItem)
}

function renderQuestion(questionObj) {
  const inner = document.querySelector('#question-slides')
  const slide = document.createElement('div')
  slide.className = 'carousel-item'
  

  const answerChoices = [...questionObj.incorrect_answers];
  questionObj.answerIndex = Math.floor(Math.random() * 3);
      
  answerChoices.splice(
        questionObj.answerIndex,
        0,
        questionObj.correct_answer
      )
    
  const question_content = document.createElement('h3')
  question_content.innerHTML = questionObj.question

  const status = document.createElement('div')
  
  slide.appendChild(question_content)
  slide.insertAdjacentHTML('beforeend',
    `<div id="answer-form">
    <br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[0]}> <label>${answerChoices[0]}</label><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[1]}> <label>${answerChoices[1]}</label><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[2]}> <label>${answerChoices[2]}</label><br>
    <input class="answer-btn" type="radio" name="answer" value=${answerChoices[3]}> <label>${answerChoices[3]}</label><br>
    </div>`
  )
  slide.appendChild(status)
  inner.appendChild(slide)

  
  slide.addEventListener('click',() => handelSelection(questionObj))
  
      
  function handelSelection(questionObj){
    const score = document.querySelector('#round-score')
    const clickEl = event.target
    const inputs = slide.getElementsByClassName('answer-btn')
    if(clickEl.tagName === 'INPUT'){
      const userChoice = clickEl.nextElementSibling.innerText
      for(let input of inputs) {
        input.disabled = true
      }
      if(userChoice === questionObj.correct_answer){
       status.innerHTML = '<br><h4 class= "correct">CORRECT!</h4>'
       score.innerText = parseInt(score.innerText) +1
       createAnswer(question= questionObj.question, correct= true)
          }else{
        status.innerHTML = '<br><h4 class= "wrong">WRONG!</h4>'
        createAnswer(question= questionObj.question, correct= false)

      }
    }
  }
  function createAnswer(question, correct) {
    const span = document.querySelector('span')
    const userId = span.dataset.id
    const configObj = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        question: question,
        correct: correct,
        user_id: userId
      })

    }

    fetch(ANSWERS_URL, configObj)
    .then(resp => resp.json())
    .then(newAnswer => console.log(newAnswer))
    .catch(err => console.log(err.message))
  }


}

function addQuestions(allQuestions) {
  allQuestions.results.forEach(questionObj => renderQuestion(questionObj))
  finishMessage()
}
  

function getQuestions() {
  fetch(QUEST_URL)
  .then(resp => resp.json())
  .then(allQuestions => addQuestions(allQuestions))
  .catch(err => console.log(err.message))
}

// message functions
function welcomeMessage() {
  let carouselMsg = document.getElementById('carousel-msg')
  let welcomeMsg = document.createElement('h3')
  welcomeMsg.setAttribute('id', 'mid-header')
  welcomeMsg.innerText = 'Welcome! Please Login to Continue'
  carouselMsg.append(welcomeMsg)
}

function startMessage() {
  let startMsg = document.getElementById('mid-header')
  startMsg.innerText = `You have 30 seconds to answer each question
                        GET READY...GET SET...`
}



function finishMessage() {
  const inner = document.querySelector('#question-slides')
  const slide = document.createElement('div')
  slide.className = 'carousel-item'
  slide.innerHTML = `<h3>Congratulations!!!</h3> <br> <button id= "submit-score"> Submit </button>`
  inner.appendChild(slide)

  slide.addEventListener('click', () => {
    const score = document.querySelector('#round-score')
    const currentScore = document.getElementById('current-score')
    const newScore = parseInt(score.innerText) + parseInt(currentScore.innerText)
    const span = document.querySelector('span')
    const userId = span.dataset.id

    reqObj = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({score: newScore})
    }

    if (event.target.id === 'submit-score') {
      fetch(`${USERS_URL}/${userId}`, reqObj)
      .then(resp => resp.json())
      .then(user => renderUserInfo(user))
    }
  })





}


main()




   

    


