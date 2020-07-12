local steps = import '../../common/steps.libsonnet';
local workflows = import '../../common/workflows.libsonnet';

local deploy_steps = [
  steps.checkout,
  steps.npm_install,
  {
    id: "payload",
    name: "generate payload",
    run: "npx ci set-outputs deploy-payload $ENVIRONMENT",
    env: {
      ENVIRONMENT: "${{ matrix.environment }}",
      TASK: "${{ matrix.task }}"
    }
  },
  {
    name: "start deployment workflow",
    run: "echo \"${PAYLOAD}\" | hub api \"repos/jbrunton/bechdel-lists/deployments\" --input -",
    env: {
      GITHUB_TOKEN: "${{ secrets.CI_MINION_ACCESS_TOKEN }}",
      PAYLOAD: "${{ steps.payload.outputs.payload }}"
    }
  }
];

{
  define(buildRequired):: workflows.ubuntu {
    "if": "needs.manifest_check.outputs.deploymentsRequired == true && needs.manifest_check.outputs.buildRequired == %s" % buildRequired,
    needs: if buildRequired then [
      "manifest_check",
      "build"
    ] else "manifest_check",
    steps: deploy_steps,
    strategy: {
      matrix: "${{ fromJson(needs.manifest_check.outputs.deploymentMatrix) }}"
    }
  }
}
