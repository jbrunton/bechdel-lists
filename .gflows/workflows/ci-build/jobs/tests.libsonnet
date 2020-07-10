local steps = import '../../common/steps.libsonnet';

local matrix_strategy = {
  matrix: {
    service: [
      "api",
      "client"
    ]
  }
};

{
  integration_tests: {
    "runs-on": "ubuntu-latest",
    steps: [
      steps.checkout,
      steps.copy_env,
      {
        env: {
          SERVICE: "${{ matrix.service }}"
        },
        name: "run",
        run: "./ci/integration_tests/${SERVICE}.sh"
      }
    ],
    strategy: matrix_strategy
  },
  unit_tests: {
    "runs-on": "ubuntu-latest",
    steps: [
      steps.checkout,
      {
        uses: "ruby/setup-ruby@v1",
        with: {
          "ruby-version": "2.6.3"
        }
      },
      steps.copy_env,
      {
        env: {
          SERVICE: "${{ matrix.service }}"
        },
        name: "run unit tests",
        run: "./ci/unit_tests/${SERVICE}.sh"
      }
    ],
    strategy: matrix_strategy
  }
}
