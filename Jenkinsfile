def app
pipeline {
  agent any
  stages {
    stage("Build") {
      steps {
        script {
          app = docker.build("dashboard")
        }
      }
    }
    stage("Push Image") {
      steps {
        script{
          docker.withRegistry("https://registry.iloa.dev", "registry-auth") {
            app.push("1.0.${env.BUILD_NUMBER}");
            app.push("latest")
          }
        }
      }
    }
  }
}