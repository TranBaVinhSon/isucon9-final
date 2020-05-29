require 'sinatra'
require 'stackprof'
require "rack-timeout"
require './app.rb'

use Rack::Timeout, service_timeout: 1500
use StackProf::Middleware, enabled: true, raw: true, mode: :cpu, interval: 250, save_every: 5
run Isutrain::App