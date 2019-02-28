console.log('ajax');
var savePoints = () => {
  var playerScore = document.querySelector('.player-score p').textContent;

  var userId = document.querySelector('.userId').textContent;

  options = {
    url: "http://localhost:4567/api/users",
    data: {
      user_id: userId,
      points: playerScore
    },
    method: 'put'
  }

  $.ajax(options);
}
