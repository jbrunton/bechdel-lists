local steps = import '../../common/steps.libsonnet';
local workflows = import '../../common/workflows.libsonnet';

workflows.ubuntu {
  needs: "manifest_check",
  "if": "${{ needs.manifest_check.outputs.buildRequired == true }}",
  env: {
    DOCKER_ACCESS_TOKEN: "${{ secrets.DOCKER_ACCESS_TOKEN }}",
    DOCKER_USERNAME: "jbrunton"
  },
  steps: [
    steps.checkout_with_token('CI_ADMIN_ACCESS_TOKEN'),
    steps.npm_install,
    steps.uses('k14s/setup-k14s-action@v1') {
      with: {
        only: 'ytt, kbld',
        token: '${{ secrets.GITHUB_TOKEN }}'
      },
    },
    steps.named('docker login', 'echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin'),
    steps.named('build', 'npx ci create build'),
    steps.commit('npx ci commit build')
  ]
}
