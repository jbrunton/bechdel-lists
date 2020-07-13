local steps = import '../../common/steps.libsonnet';
local workflows = import '../../common/workflows.libsonnet';

local matrix_strategy = {
  matrix: {
    service: [
      "api",
      "client"
    ]
  }
};

{
  integration_tests: workflows.ubuntu {
    steps: [
      steps.checkout,
      steps.copy_env,
      steps.named("run", "./ci/integration_tests/${SERVICE}.sh") {
        env: { SERVICE: "${{ matrix.service }}" }
      }
    ],
    strategy: matrix_strategy
  },
  unit_tests: workflows.ubuntu {
    steps: [
      steps.checkout,
      steps.setup_ruby,
      steps.copy_env,
      steps.named("run unit tests", "./ci/unit_tests/${SERVICE}.sh") {
        env: {
          SERVICE: "${{ matrix.service }}"
        }
      }
    ],
    strategy: matrix_strategy
  }
}
