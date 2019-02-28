console.log('ajax');

var playerScore = document.querySelector('.player-score p');

var userId = document.querySelector('.userId');


options = {
  url: "http://localhost:4567/api/users",
  data: {
    user_id: userId,
    points: playerScore
  },
  method: 'put'
}

$.ajax(options);
