local steps = import '../../common/steps.libsonnet';
local workflows = import '../../common/workflows.libsonnet';

workflows.ubuntu {
  "if": "${{ github.event.deployment.task == 'update_manifest' }}",
  steps: [
    steps.checkout_with_token('CI_ADMIN_ACCESS_TOKEN'),
    steps.npm_install,
    {
      env: {
        ENVIRONMENT: "${{ github.event.deployment.payload.environment }}",
        VERSION: "${{ github.event.deployment.payload.version }}"
      },
      name: "Update manifest",
      run: "git config --global user.email \"jbrunton-ci-minion@outlook.com\"\ngit config --global user.name \"jbrunton-ci-minion\"\n\nnpx ci update-manifest $VERSION $ENVIRONMENT\n\ngit push origin HEAD:master\n"
    }
  ]
}
