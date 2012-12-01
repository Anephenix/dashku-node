{print}       = require 'util'
{spawn, exec} = require 'child_process'
mocha         = require 'mocha'

build = (watch, callback) ->
  if typeof watch is 'function'
    callback = watch
    watch = false
  options = ['-c', '-o', 'lib', 'src']
  options.unshift '-w' if watch

  coffee = spawn 'coffee', options
  coffee.stdout.on 'data', (data) -> print data.toString()
  coffee.stderr.on 'data', (data) -> print data.toString()
  coffee.on 'exit', (status) -> callback?() if status is 0

files = [
  'dashku.coffee',
]

buildDocs = (callback) ->
  for file in files
    exec "node_modules/docco/bin/docco src/#{file}",
      (err, stdout, stderr) ->
        print stdout if stdout?
        print stderr if stderr?

test = (callback) ->
  Mocha = new mocha
  for file in files
    Mocha.addFile "test/#{file.replace('.coffee','_test.coffee')}"
  Mocha.run callback

task 'build', 'Compiles source files in src directory, and outputs to the lib directory', ->
  build()

task 'docs', 'Generates docs for all the source files', ->
  buildDocs()

task 'watch', 'Recompile CoffeeScript source files when modified', ->
  build true

task 'test', 'Run mocha specs', ->
  test -> process.exit 0