local run (command) = { run: command };
local named (name, command) = { name: name, run: command };
local uses(action) = { uses: action };

{
  checkout: uses('actions/checkout@v2'),

  checkout_with_token(token):: uses('actions/checkout@v2') {
    with: {
      token: "${{ secrets.%s }}" % token
    }
  },
  
  setup_go: uses('actions/setup-go@v2') {
    with: {
      'go-version': '^1.14.4'
    }
  },

  uses:: uses,

  copy_env: named("copy .env", "cp ci/ci.env .env"),

  npm_install: named('npm install', 'npm install'),

  update_status(name, state):: {
    name: name,
    uses: "deliverybot/status@master",
    with: {
      state: state,
      token: "${{ secrets.GITHUB_TOKEN }}"
    }
  },

  commit(command)::
    named('commit', |||
      git config --global user.email "jbrunton-ci-minion@outlook.com"
      git config --global user.name "jbrunton-ci-minion"

      %s
      
      git push origin HEAD:master
    ||| % command),

  run:: run,
  
  named:: named,
}
