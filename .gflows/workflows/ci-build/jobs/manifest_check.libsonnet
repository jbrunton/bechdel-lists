local steps = import '../../common/steps.libsonnet';

{
  needs: [
    "unit_tests",
    "integration_tests"
  ],
  outputs: {
    buildRequired: "${{ steps.check.outputs.buildRequired }}",
    deploymentMatrix: "${{ steps.check.outputs.deploymentMatrix }}",
    deploymentsRequired: "${{ steps.check.outputs.deploymentsRequired }}"
  },
  "runs-on": "ubuntu-latest",
  steps: [
    steps.checkout,
    {
      id: "check",
      "if": "github.event.ref == 'refs/heads/master'",
      name: "check manifest",
      run: "npm install\nnpx ci set-outputs manifest-checks\n"
    }
  ]
}
