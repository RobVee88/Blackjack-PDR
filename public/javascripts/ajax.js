console.log('ajax');
var savePoints = () => {
  var playerScore = document.querySelector('.leaderboard-score').textContent;

  var userId = document.querySelector('.userId').textContent;

  options = {
    url: "/api/users",
    data: {
      user_id: userId,
      points: playerScore
    },
    method: 'put'
  }

  $.ajax(options);
}
