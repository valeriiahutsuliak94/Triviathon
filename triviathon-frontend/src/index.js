const USERS_URL = "http://localhost:3000/users"
const QUEST_URL = "https://opentdb.com/api.php?amount=26"
const form = document.getElementById('login-form')
// const butt = document.querySelector('')

function main() {
  document.addEventListener('DOMContentLoaded', function(){ 
    // render all users & scores in left sidebar
    getAllUsers()

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      
      let user = grabUserData(e)
      e.target.reset()

      loginUser(user)
      
    })

    getQuestions()
  

  })
}

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
  }

  function grabUserData(e) {
    return {username: e.target.children[1].value} 
  }

  function renderUserInfo(user) {
    const infosec = document.querySelector('.user-info')
    infosec.innerHTML = `<span data-id= ${user.id}><p>Name: ${user.username}</p><p>Score: ${user.score}</p>`
  }

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
  const inner = document.querySelector('.carousel-inner')
  const slide = document.createElement('div')
  slide.className = 'carousel-item'

  const question_content = document.createElement('h3')
  question_content.innerHTML = questionObj.question

  slide.appendChild(question_content)
  inner.appendChild(slide)

}

function addQuestions(allQuestions) {
  allQuestions.results.forEach(questionObj => renderQuestion(questionObj))
}

function getQuestions() {
  fetch(QUEST_URL)
  .then(resp => resp.json())
  .then(allQuestions => addQuestions(allQuestions))
}


main()

        




   

    


