local steps = import '../common/steps.libsonnet';
local deploy_job = import 'jobs/deploy.libsonnet';
local update_manifest_job = import 'jobs/update_manifest.libsonnet';

local workflow = {
  env: {
    CI: 1,
    DOCKER_ACCESS_TOKEN: "${{ secrets.DOCKER_ACCESS_TOKEN }}",
    DOCKER_USERNAME: "jbrunton",
    FORCE_COLOR: 1
  },
  jobs: {
    deploy: deploy_job,
    update_manifest: update_manifest_job
  },
  name: "ci-deploy",
  on: "deployment"
};

std.manifestYamlDoc(workflow)
