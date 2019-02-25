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





