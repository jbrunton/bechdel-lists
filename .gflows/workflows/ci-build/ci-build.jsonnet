local steps = import '../common/steps.libsonnet';

local matrix_strategy = {
  matrix: {
    service: [
      "api",
      "client"
    ]
  }
};

local deploy_job (buildRequired) =
  local deploy_steps = [
    steps.checkout,
    steps.named("npm install", "npm install"),
    {
      env: {
        ENVIRONMENT: "${{ matrix.environment }}",
        TASK: "${{ matrix.task }}"
      },
      id: "payload",
      name: "generate payload",
      run: "npx ci set-outputs deploy-payload $ENVIRONMENT"
    },
    {
      env: {
        GITHUB_TOKEN: "${{ secrets.CI_MINION_ACCESS_TOKEN }}",
        PAYLOAD: "${{ steps.payload.outputs.payload }}"
      },
      name: "start deployment workflow",
      run: "echo \"${PAYLOAD}\" | hub api \"repos/jbrunton/bechdel-lists/deployments\" --input -"
    }
  ];
  local needs = if buildRequired then [
    "manifest_check",
    "build"
  ] else "manifest_check";
  {
    "if": "needs.manifest_check.outputs.deploymentsRequired == true && needs.manifest_check.outputs.buildRequired == %s" % buildRequired,
    needs: needs,
    "runs-on": "ubuntu-latest",
    steps: deploy_steps,
    strategy: {
      matrix: "${{ fromJson(needs.manifest_check.outputs.deploymentMatrix) }}"
    }
  };

local workflow = {
  env: {
    CI: 1,
    FORCE_COLOR: 1,
    WORKSPACE: "${{ github.workspace }}"
  },
  jobs: {
    build: {
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
    },
    deploy_existing_build: deploy_job(false),
    deploy_new_build: deploy_job(true),
    integration_tests: {
      "runs-on": "ubuntu-latest",
      steps: [
        steps.checkout,
        steps.copy_env,
        {
          env: {
            SERVICE: "${{ matrix.service }}"
          },
          name: "run",
          run: "./ci/integration_tests/${SERVICE}.sh"
        }
      ],
      strategy: matrix_strategy
    },
    manifest_check: {
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
    },
    unit_tests: {
      "runs-on": "ubuntu-latest",
      steps: [
        steps.checkout,
        {
          uses: "ruby/setup-ruby@v1",
          with: {
            "ruby-version": "2.6.3"
          }
        },
        steps.copy_env,
        {
          env: {
            SERVICE: "${{ matrix.service }}"
          },
          name: "run unit tests",
          run: "./ci/unit_tests/${SERVICE}.sh"
        }
      ],
      strategy: matrix_strategy
    }
  },
  name: "ci-build",
  on: {
    pull_request: {
      branches: [
        "master"
      ]
    },
    push: {
      branches: [
        "master"
      ],
      "paths-ignore": [
        "deployments/**"
      ]
    }
  }
};

std.manifestYamlDoc(workflow)
