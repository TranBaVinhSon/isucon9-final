require 'sinatra'
require './app.rb'
require "rack-timeout"

run Isutrain::App
se Rack::Timeout, service_timeout: 15