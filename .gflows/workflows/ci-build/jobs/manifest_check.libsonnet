local steps = import '../../common/steps.libsonnet';
local workflows = import '../../common/workflows.libsonnet';

workflows.ubuntu {
  needs: [
    "unit_tests",
    "integration_tests"
  ],
  outputs: {
    buildRequired: "${{ steps.check.outputs.buildRequired }}",
    deploymentMatrix: "${{ steps.check.outputs.deploymentMatrix }}",
    deploymentsRequired: "${{ steps.check.outputs.deploymentsRequired }}"
  },
  steps: [
    steps.checkout,
    {
      id: "check",
      "if": "github.event.ref == 'refs/heads/develop'",
      name: "check manifest",
      run: |||
        npm install
        npx ci set-outputs manifest-checks
      |||
    }
  ]
}
