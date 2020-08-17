
{
  local steps = self,

  run(command):: { run: command },
  named(name, command):: steps.run(command) { name: name },
  uses(action):: { uses: action},
  checkout: steps.uses('actions/checkout@v2'),

  checkout_with_token(token):: steps.checkout {
    with: {
      token: "${{ secrets.%s }}" % token
    }
  },
  
  setup_go: steps.uses('actions/setup-go@v2') {
    with: {
      'go-version': '^1.14.4'
    }
  },

  setup_ruby: steps.uses("ruby/setup-ruby@v1") {
    with: {
      "ruby-version": "2.6.3"
    }
  },

  copy_env: steps.named("copy .env", "cp ci/ci.env .env"),

  npm_install: steps.named('npm install', 'npm install'),

  update_status(name, state):: {
    name: name,
    uses: "deliverybot/status@master",
    with: {
      state: state,
      token: "${{ secrets.GITHUB_TOKEN }}"
    }
  },

  commit(command):: steps.named('commit', |||
    git config --global user.email "jbrunton-ci-minion@outlook.com"
    git config --global user.name "jbrunton-ci-minion"

    %s
    
    git push origin HEAD:develop
  ||| % command),
}
