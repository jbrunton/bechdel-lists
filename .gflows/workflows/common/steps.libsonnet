local run (command) = { run: command };
local named (name, command) = { name: name, run: command };

{
  checkout: {
    uses: 'actions/checkout@v2'
  },

  checkout_with_token(token):: {
    uses: 'actions/checkout@v2',
    with: {
      token: "${{ secrets.%s }}" % token
    }
  },
  
  setup_go: {
    uses: 'actions/setup-go@v2',
    with: {
      'go-version': '^1.14.4'
    }
  },

  copy_env: named("copy .env", "cp ci/ci.env .env"),

  update_status(name, state)::  {
    name: name,
    uses: "deliverybot/status@master",
    with: {
      state: state,
      token: "${{ secrets.GITHUB_TOKEN }}"
    }
  },

  run:: run,
  
  named:: named,
}
