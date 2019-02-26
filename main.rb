require 'sinatra'
require 'active_record'
require 'sinatra/reloader'
require 'pry'
require 'pg'
require_relative 'db_config'
require_relative 'models/user'


get '/' do
  erb :index
end

get '/login' do
  # redirect '/' if current_user
  erb :login
end


post '/session' do
  user = if params[:role] == "user"
    User.find_by(email: params[:email])
  end

  # check email first
  if user && user.authenticate(params[:password])
    session[:user_id] = user.id
    session[:role] = params[:role]
    # redirect to secure place
    redirect '/'
  else
    # show the login form becus pw or email wrong
    erb :login
  end
end

get '/session' do
  session[:user_id] = nil
  session[:role] = nil
  redirect '/login'
end


get '/register' do
  erb :register
end

get '/about' do
  erb :about
end

get '/howtoplay' do

  erb :howtoplay
end