# To be run from root directory of the main plugin project
setup_file() {
   npm run clean-test
   cd test/project
}

setup() {
   load '../node_modules/bats-assert/load'
}

teardown() {
   npm run clean
}

CONFIG="transformer-add-source.config.js"

@test "Requires a config file to be present" {
  run npm run build

  assert_output --partial "Could not find a config file"
  assert_output --partial "Create a $CONFIG file in the project root."
}


@test "Requires export from config file to be an object" {
  cp config-template/non-object-export.js $CONFIG
  run npm run build

  assert_output --partial "Invalid config file"
  assert_output --partial "Please ensure that $CONFIG exports a valid Javascript object."
}

@test "Requires encode export from config file to be a function" {
  cp config-template/invalid-encode.js $CONFIG
  run npm run build

  assert_output --partial "Invalid encoding function"
  assert_output --partial "Please ensure that $CONFIG exports a valid \`encode\` function."
}

@test "Requires addSourceCode export from config file to be present" {
  cp config-template/without-add-source-code.js $CONFIG
  run npm run build

  assert_output --partial "Missing transformation function"
  assert_output --partial "Please ensure that $CONFIG exports an \`addSourceCode\` function."
}

@test "Requires addSourceCode export from config file to be a function" {
  cp config-template/invalid-add-source-code.js $CONFIG
  run npm run build

  assert_output --partial "Invalid transformation function"
  assert_output --partial "Please ensure that $CONFIG exports a valid \`addSourceCode\` function."
}

@test "Default transformation" {
  cp config-template/default-config.js $CONFIG
  npm run build
  # Asserts that base64 encoding of hello world is present
  run grep "console.log(\"Y29uc29sZS5sb2coYEhlbGxvLCBXb3JsZCFgKTsK\")" build/index*.js

 [ "$status" -eq 0 ]
}

@test "Custom encoding transformation" {
  cp config-template/custom-encode-config.js $CONFIG
  npm run build
  # Asserts that base64 encoding of hello world is present
  run grep "console.log(\"636f6e736f6c652e6c6f67286048656c6c6f2c20576f726c642160293b0a\")" build/index*.js

 [ "$status" -eq 0 ]
}