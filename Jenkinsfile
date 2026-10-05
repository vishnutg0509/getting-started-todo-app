pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-southeast-2'
        ECR_REPO = '075810104493.dkr.ecr.ap-southeast-2.amazonaws.com/todo-app'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        EKS_CLUSTER = 'devops-project3'
        K8S_NAMESPACE = 'todo'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                sh '''
                    docker build --target test -t todo-app-test .
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                    trivy image --exit-code 0 --severity HIGH,CRITICAL ${ECR_REPO}:${IMAGE_TAG}
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login \
                    --username AWS \
                    --password-stdin ${ECR_REPO}
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    docker push ${ECR_REPO}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                    aws eks update-kubeconfig \
                      --region ${AWS_REGION} \
                      --name ${EKS_CLUSTER}

                    kubectl apply -f k8s/deployment.yaml

                    kubectl set image deployment/todo-app \
                      todo-app=${ECR_REPO}:${IMAGE_TAG} \
                      -n ${K8S_NAMESPACE}

                    kubectl rollout status deployment/todo-app \
                      -n ${K8S_NAMESPACE} \
                      --timeout=180s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl get pods -n ${K8S_NAMESPACE} -o wide
                    kubectl get svc -n ${K8S_NAMESPACE}
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'CI/CD pipeline failed. Check the Jenkins console output.'
        }
    }
}
