pipeline {
    agent none
    options {
        quietPeriod(5)
    }
    stages {
        stage('Test - Front End') {
            agent {
                docker {
                    image 'mariosdrth/ubuntu-node-ng-chrome:1.0'
                    args '--privileged'
                    reuseNode true
                }
            }
            options {
                timeout(time: 5, unit: 'MINUTES')
            }
            steps {
                sh 'npm install'
                sh 'npm rebuild node-sass'
                sh 'npm test'
            }
            post {
                always {
                    junit 'src/test-results/*.xml'
                }
            }
        }
        stage('Build - Front End') {
            agent {
                docker {
                    image 'mariosdrth/ubuntu-node-ng-chrome:1.0'
                    args '--privileged'
                    reuseNode true
                }
            }
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
            steps {
                sh 'ng build --prod'
            }
        }
        stage('Prepare Docker Deployment') {
            agent any
            options {
                timeout(time: 2, unit: 'MINUTES')
            }
            steps {
                dir('/var/jenkins_home/medapp_server') {
                    sh 'rm -rf med_app'
                    sh 'mkdir med_app'
                }
                dir('/var/jenkins_home/medapp_server/med_app') {
                    git(
                       url: 'https://github.com/mariosdrth/Med_Docker.git',
                       credentialsId: 'git-creds',
                       branch: 'master',
                       changelog: false,
                       poll: false
                    )
                }
            }
        }
        stage('Build - Backend') {
            agent {
                docker {
                    image 'maven:alpine'
                    args '-v /root/.m2:/root/.m2'
                }
            }
            options {
                timeout(time: 4, unit: 'MINUTES')
            }
            steps {
                dir('/var/jenkins_home/medapp_server/med_app/server') {
                    sh 'mkdir clone'
                }
                dir('/var/jenkins_home/medapp_server/med_app/server/clone') {
                    git(
                       url: 'https://github.com/mariosdrth/Med-App-Server.git',
                       credentialsId: 'git-creds',
                       branch: 'master',
                       changelog: false,
                       poll: false
                    )
                    sh 'mvn -B -DskipTests clean package'
                }
                dir('/var/jenkins_home/medapp_server') {
                    sh 'rm ./med_app/server/gdpr.jar'
                    sh 'cp ./med_app/server/clone/target/*.jar /var/jenkins_home/medapp_server/med_app/server/gdpr.jar'
                }
            }
        }
        stage('Deploy') {
            agent any
            options {
                timeout(time: 4, unit: 'MINUTES')
            }
            steps {
                dir('/var/jenkins_home/medapp_server/med_app') {
                    sh 'docker-compose down'
                    sh 'cp -r /var/jenkins_home/workspace/pipeline-med-app-client/dist/* /var/jenkins_home/medapp_server/med_app/client/dist/.'
                    sh 'docker-compose build --no-cache'
                    sh 'docker image prune -f'
                    sh 'docker-compose up -d'
                }
            }
        }
    }
}