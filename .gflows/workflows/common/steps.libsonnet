local run (command) = { run: command };
local named (name, command) = { name: name, run: command };

{
  checkout: {
    uses: 'actions/checkout@v2'
  },
  
  setup_go: {
    uses: 'actions/setup-go@v2',
    with: {
      'go-version': '^1.14.4'
    }
  },

  copy_env: named("copy .env", "cp ci/ci.env .env"),
  
  run:: run,
  
  named:: named,
}
