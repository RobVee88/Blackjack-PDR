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
user.username = params[:username]
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

    redirect '/'
  else
    erb :login
  end
end

get '/session' do
  session[:user_id] = nil
  redirect '/login'
end

delete '/session' do
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

  erb :game
end

