pipeline {
    agent none
    stages {
        stage('Preparation') {
            agent any
            steps {
                sh 'rm -rf med_app'
                sh 'mkdir med_app'
                dir('med_app') {
                    git(
                       url: 'https://github.com/mariosdrth/Med_Docker.git',
                       credentialsId: 'git-creds',
                       branch: 'master'
                    )
                }
            }
        }
        stage('Build - Front End') {
            agent {
                docker {
                    image 'alexsuch/angular-cli:6.0'
                    args '--privileged'
                }
            }
            steps {
                sh 'npm install'
                sh 'ng build --prod'
            }
        }
    }
}