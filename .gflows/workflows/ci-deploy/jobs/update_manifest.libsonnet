local steps = import '../../common/steps.libsonnet';
local workflows = import '../../common/workflows.libsonnet';

workflows.ubuntu {
  "if": "${{ github.event.deployment.task == 'update_manifest' }}",
  steps: [
    steps.checkout_with_token('CI_ADMIN_ACCESS_TOKEN'),
    steps.npm_install,
    steps.commit("npx ci update-manifest $VERSION $ENVIRONMENT") {
      name: "Update manifest",
      env: {
        ENVIRONMENT: "${{ github.event.deployment.payload.environment }}",
        VERSION: "${{ github.event.deployment.payload.version }}"
      },
    }
  ]
}
