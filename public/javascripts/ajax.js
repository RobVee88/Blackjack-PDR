console.log('ajax');

var playerScore = document.querySelector('.player-score p')

options = {
  url: "http://localhost:4567/api/users",
  data: {
    user_id: userId
  },
  method: 'put'
}

$.ajax(options);
