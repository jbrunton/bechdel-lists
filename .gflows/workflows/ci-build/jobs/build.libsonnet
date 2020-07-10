local steps = import '../../common/steps.libsonnet';

{
  env: {
    DOCKER_ACCESS_TOKEN: "${{ secrets.DOCKER_ACCESS_TOKEN }}",
    DOCKER_USERNAME: "jbrunton"
  },
  "if": "${{ needs.manifest_check.outputs.buildRequired == true }}",
  needs: "manifest_check",
  "runs-on": "ubuntu-latest",
  steps: [
    {
      uses: "actions/checkout@v2",
      with: {
        token: "${{ secrets.CI_ADMIN_ACCESS_TOKEN }}"
      }
    },
    steps.named('npm install', 'npm install'),
    steps.named('docker login', 'echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin'),
    steps.named('build', 'npx ci create build'),
    steps.named('commit', |||
      git config --global user.email "jbrunton-ci-minion@outlook.com"
      git config --global user.name "jbrunton-ci-minion"

      npx ci commit build
      
      git push origin HEAD:master
    |||),
  ]
}
