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
get '/register' do

  erb :register
end

post '/register' do
user = User.new
user.name = params[:name]
user.email = params[:email]
user.password = params[:password]
user.save
redirect '/login'
end

get '/login' do
  redirect '/' if current_user
  erb :login
end

post '/session' do
  user = User.find_by(email: params[:email])

  if user && user.authenticate(params[:password])
    session[:user_id] = user.id

    redirect '/game'
  else
    erb :login
  end
end

delete '/session' do
  session[:user_id] = nil
  redirect '/'
end

get '/session' do
  session[:user_id] = nil
  redirect '/login'
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
  redirect '/login' unless logged_in?

  erb :leaderboard
end

get '/game' do
  redirect '/login' unless logged_in?
  erb :game
end

post '/api/users' do
  user = User.new
  user.points = params[:points]
  user.save 
  content_type 'application/json'
  {
    points: User.where(user_id: params[:user_id])
  }.to_json
end

get '/api/users' do
  users = User.all
  content_type 'application/json'
  users.to_json
end