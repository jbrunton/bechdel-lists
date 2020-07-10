local deploy_job = import 'jobs/deploy.libsonnet';
local build_job = import 'jobs/build.libsonnet';
local tests = import 'jobs/tests.libsonnet';
local manifest_check_job = import 'jobs/manifest_check.libsonnet';
local workflows = import '../common/workflows.libsonnet';

local workflow = {
  env: {
    CI: 1,
    FORCE_COLOR: 1,
    WORKSPACE: "${{ github.workspace }}"
  },
  jobs: {
    build: build_job,
    deploy_existing_build: deploy_job.define(false),
    deploy_new_build: deploy_job.define(true),
    integration_tests: tests.integration_tests,
    manifest_check: manifest_check_job,
    unit_tests: tests.unit_tests
  },
  name: "ci-build",
  on: workflows.triggers.pull_request_defaults {
    push+: {
      "paths-ignore": [
        "deployments/**"
      ],
    }
  }
};

std.manifestYamlDoc(workflow)
