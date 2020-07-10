local workflow = {
  env: {
    CI: 1,
    DOCKER_ACCESS_TOKEN: "${{ secrets.DOCKER_ACCESS_TOKEN }}",
    DOCKER_USERNAME: "jbrunton",
    FORCE_COLOR: 1
  },
  jobs: {
    deploy: {
      env: {
        ENVIRONMENT: "${{ github.event.deployment.environment }}"
      },
      "if": "${{ github.event.deployment.task == 'deploy' }}",
      "runs-on": "ubuntu-latest",
      steps: [
        {
          uses: "actions/checkout@v2",
          with: {
            token: "${{ secrets.CI_ADMIN_ACCESS_TOKEN }}"
          }
        },
        {
          name: "Deployment pending",
          uses: "deliverybot/status@master",
          with: {
            state: "pending",
            token: "${{ secrets.GITHUB_TOKEN }}"
          }
        },
        {
          name: "npm install",
          run: "npm install"
        },
        {
          id: "deployment_info",
          name: "deployment info",
          run: "npx ci set-outputs deployment-info $ENVIRONMENT"
        },
        {
          env: {
            HOST: "${{ steps.deployment_info.outputs.host }}",
            KEY: "${{ secrets.DEPLOYER_SSH_KEY }}",
            USERNAME: "deployer"
          },
          name: "copy files",
          uses: "appleboy/scp-action@master",
          with: {
            overwrite: true,
            source: "${{ steps.deployment_info.outputs.buildFile }},monitoring,docker-compose.monitoring.yml",
            target: "."
          }
        },
        {
          env: {
            BUILD_FILE: "${{ steps.deployment_info.outputs.buildFile }}",
            BUILD_VERSION: "${{ steps.deployment_info.outputs.buildVersion }}",
            HOST: "${{ steps.deployment_info.outputs.host }}",
            KEY: "${{ secrets.DEPLOYER_SSH_KEY }}",
            POSTGRES_CONNECTION: "${{ secrets.POSTGRES_PRODUCTION_CONNECTION }}",
            RAILS_MASTER_KEY: "${{ secrets.RAILS_PRODUCTION_MASTER_KEY }}",
            USERNAME: "deployer"
          },
          name: "deploy",
          uses: "appleboy/ssh-action@master",
          with: {
            envs: "POSTGRES_CONNECTION,RAILS_MASTER_KEY,BUILD_FILE,BUILD_VERSION",
            script: "ln -sf $BUILD_FILE docker-compose.yml\nexport BUILD_VERSION\nexport POSTGRES_CONNECTION\nexport RAILS_MASTER_KEY\nexport COMPOSE_FILE=\"docker-compose.yml:docker-compose.monitoring.yml\"\ndocker-compose up --detach --no-build --remove-orphans\ndocker-compose run api bin/rails db:migrate\n"
          }
        },
        {
          name: "commit",
          run: "git config --global user.email \"jbrunton-ci-minion@outlook.com\"\ngit config --global user.name \"jbrunton-ci-minion\"\n\nnpx ci commit deployment $ENVIRONMENT\n\ngit push origin HEAD:master\n"
        },
        {
          "if": "success()",
          name: "notify success",
          uses: "deliverybot/status@master",
          with: {
            state: "success",
            token: "${{ secrets.GITHUB_TOKEN }}"
          }
        },
        {
          "if": "failure()",
          name: "notify failure",
          uses: "deliverybot/status@master",
          with: {
            state: "failure",
            token: "${{ secrets.GITHUB_TOKEN }}"
          }
        }
      ]
    },
    update_manifest: {
      "if": "${{ github.event.deployment.task == 'update_manifest' }}",
      "runs-on": "ubuntu-latest",
      steps: [
        {
          uses: "actions/checkout@v2",
          with: {
            token: "${{ secrets.CI_ADMIN_ACCESS_TOKEN }}"
          }
        },
        {
          name: "npm install",
          run: "npm install"
        },
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
  },
  name: "ci-deploy",
  on: "deployment"
};

std.manifestYamlDoc(workflow)
