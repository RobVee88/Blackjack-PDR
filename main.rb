require 'sinatra'
require 'active_record'
require 'sinatra/reloader'
require 'pry'
require 'pg'
require_relative 'db_config'
require_relative 'models/user'

# to enable random string - when the user loginIn
enable :sessions # sinatra dealing with storing the session for you

 ### HELPERS METHODS ###
 helpers do
  def current_user
    User.find_by(id: session[:user_id])
  end

  def logged_in?
    if current_user
      return true
    else
      return false
    end
  end
end


## USERS ##
get '/signup' do

  erb :signup
end

post '/signup' do
user = User.new
user.name = params[:name]
user.email = params[:email]
user.password = params[:password]
user.save
redirect '/'
end

get '/login' do
  redirect '/' if current_user
  erb :signup
end

post '/session' do
  user = User.find_by(email: params[:email])

  if user && user.authenticate(params[:password])
    session[:user_id] = user.id

    redirect '/leaderboard'
  else
    erb :signup
  end
end

delete '/session' do
  session[:user_id] = nil
  redirect '/'
end

get '/session' do
  session[:user_id] = nil
  redirect '/'
end

### ROUTES ###

get '/' do

  erb :index
end

get '/about' do

  erb :about
end

get '/howtoplay' do

  erb :howtoplay
end

get '/leaderboard' do
  redirect '/' unless logged_in?

  @leaders = User.order('points DESC').limit(10)
  erb :leaderboard
end

get '/game' do
  redirect '/' unless logged_in?
  @user_id = session[:user_id]
  erb :game
end

# updating user or points
put '/api/users' do
  user = User.find(params[:user_id])
  user.points = params[:points]
  user.save 
  content_type 'application/json'
  user.to_json
end

# get '/api/users' do
#   users = User.all
#   content_type 'application/json'
#   users.to_json
# end