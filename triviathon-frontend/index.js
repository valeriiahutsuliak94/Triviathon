const USERS_URL = "http://localhost:3000/users"
const form = document.getElementsByClassName('card')

document.addEventListener('DOMContentLoaded', function(){   

   

    form.addEventListener('submit', (e) => {
        const postObj = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              'username': `${event.target.name.value}`,
              'score' : 0
              
            })
        }

        function findUser(){
        fetch(USERS_URL, postObj)
        .then(resp => resp.json())
        .then(users => addUsers(user))
        }
        form.reset()
    
    })
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
    
    
})

        




   

    


