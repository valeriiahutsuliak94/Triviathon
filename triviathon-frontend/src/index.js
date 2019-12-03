const USERS_URL = "http://localhost:3000/users"
const form = document.getElementById('login-form')
// const butt = document.querySelector('')

function main() {
  document.addEventListener('DOMContentLoaded', function(){ 
    // loginUser()  
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      
      let user = grabUserData(e)

      loginUser(user)
      
    })
  

  })
}

function loginUser(user) {
  
  const name = user.username
  // debugger
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
  .then(user => console.log(user))
  // fetch POST to user url
  // render user info to right sidebar
}

function grabUserData(e) {
  e.target.reset()
  return {username: e.target.children[1].value} 
}

function getUserData(){
  const currentUser = {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
          
      
      
      })

  }

}

function findUser(){
  fetch(USERS_URL, postObj)
  .then(resp => resp.json())
  .then(users => addUsers(user))
  }
  form.reset()




main()

        




   

    


