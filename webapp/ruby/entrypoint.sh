#!/bin/bash

gem install bundler:1.17.2
bundle install --path vendor/bundle
bundle exec puma -b tcp://0.0.0.0:8000
