local steps = import '../../common/steps.libsonnet';
local workflows = import '../../common/workflows.libsonnet';

workflows.ubuntu {
  env: {
    DOCKER_ACCESS_TOKEN: "${{ secrets.DOCKER_ACCESS_TOKEN }}",
    DOCKER_USERNAME: "jbrunton"
  },
  "if": "${{ needs.manifest_check.outputs.buildRequired == true }}",
  needs: "manifest_check",
  steps: [
    steps.checkout_with_token('CI_ADMIN_ACCESS_TOKEN'),
    steps.npm_install,
    steps.named('docker login', 'echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin'),
    steps.named('build', 'npx ci create build'),
    steps.commit('npx ci commit build')
  ]
}
