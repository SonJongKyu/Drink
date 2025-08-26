pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose-build.yml"
        HARBOR_URL          = "192.168.3.81"
        SONAR_HOST_URL      = "http://192.168.3.81:10111"
        SONAR_PROJECT_KEY   = "dlink-apps"
    }

    stages {

        stage('Build & SonarQube Analysis') {
            steps {
                script {
                    dir('spring-app') {
                        sh "./gradlew classes"
                    }

                    withSonarQubeEnv('sonarqube') {
                        withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_AUTH_TOKEN')]) {
                            sh """
                            sonar-scanner \\
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \\
                                -Dsonar.sources=. \\
                                -Dsonar.java.binaries=\$(find . -type d -name "build" | paste -sd ",") \\
                                -Dsonar.ts.tslint.reportPaths=reports/tslint.json \\
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \\
                                -Dsonar.host.url=${SONAR_HOST_URL} \\
                                -Dsonar.login=\$SONAR_AUTH_TOKEN
                            """
                        }
                    }
                }
            }
        }

        stage('Check SonarQube Quality Gate') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_AUTH_TOKEN')]) {
                        sleep 10
                        def response = sh(
                            script: """
                                curl -u "\$SONAR_AUTH_TOKEN:" \\
                                "${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}"
                            """,
                            returnStdout: true
                        ).trim()

                        def json = readJSON(text: response)
                        def qualityGateStatus = json.projectStatus.status

                        if (qualityGateStatus != "OK") {
                            error "❌ Pipeline failed due to Quality Gate failure: ${qualityGateStatus}"
                        } else {
                            echo "✅ Quality Gate passed successfully!"
                        }
                    }
                }
            }
        }

        stage('Detect & Build Changed Applications') {
            steps {
                script {
                    // (1) `git diff` 실행하여 변경된 `image:` 라인만 추출
                    def composeDiff = sh(
                        script: "git diff HEAD^ HEAD -- ${DOCKER_COMPOSE_FILE} | grep '^+.*image:' || true",
                        returnStdout: true
                    ).trim()

                    // (2) 변경된 라인이 없으면 스킵
                    if (!composeDiff) {
                        echo "🚀 No image changes detected in ${DOCKER_COMPOSE_FILE}. Skipping build."
                        currentBuild.result = 'SUCCESS'
                        return
                    }

                    echo "📌 변경된 이미지 라인:\n${composeDiff}" // ✅ 디버깅용

                    def servicesToBuild = []
                    def versionMap = [:]
                    def pattern = ~/image:\s*(\S+)\/dlink\/([^:]+):([\w\.-]+)/  // 정규식 개선

                    // (3) `+` 기준으로 줄을 분리하여 처리
                    composeDiff.split('\n').each { line ->
                        line = line.trim() // 앞뒤 공백 제거
                        if (line.startsWith('+')) { // `+` 포함된 줄만 처리
                            def matcher = pattern.matcher(line)
                            if (matcher.find()) {
                                def harborUrl = matcher.group(1)   // IP 또는 레지스트리 주소
                                def serviceName = matcher.group(2) // 서비스명
                                def versionTag = matcher.group(3)  // 버전

                                echo "✅ 변경 감지됨: 서비스=${serviceName}, 버전=${versionTag}"

                                servicesToBuild.add(serviceName)
                                versionMap[serviceName] = versionTag
                            }
                        }
                    }

                    // (4) 중복 제거 및 최종 빌드할 서비스 확인
                    servicesToBuild = servicesToBuild.unique()
                    if (servicesToBuild.isEmpty()) {
                        echo "🚀 No services need to be built. Skipping."
                        currentBuild.result = 'SUCCESS'
                        return
                    }

                    env.SERVICES_TO_BUILD = servicesToBuild.join(" ")
                    env.VERSION_MAP = versionMap.collect { k, v -> "${k}:${v}" }.join(",")

                    echo "🛠️ 현재 감지된 서비스 리스트: ${servicesToBuild}"
                    echo "🛠️ 현재 감지된 버전 맵: ${versionMap}"

                    // (5) Docker build 실행
                    def buildCommand = "docker compose -f ${DOCKER_COMPOSE_FILE} build ${servicesToBuild.join(' ')}"
                    echo "🚀 실행할 Docker Build 명령어: ${buildCommand}"
                    sh buildCommand
                }
            }
        }

        stage('Login & Push Changed Applications') {
            when {
                expression { env.SERVICES_TO_BUILD && env.SERVICES_TO_BUILD.trim() != "" }
            }
            steps {
                script {
                    // 1) Harbor 로그인
                    withCredentials([usernamePassword(credentialsId: 'harbor-access', usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                        sh "docker login ${HARBOR_URL} -u ${HARBOR_USER} -p ${HARBOR_PASS}"
                    }
                    // 2) 이미지 푸시
                    withDockerRegistry([credentialsId: 'harbor-access', url: "https://${HARBOR_URL}"]) {
                        sh "docker compose -f ${DOCKER_COMPOSE_FILE} push ${env.SERVICES_TO_BUILD}"
                    }
                }
            }
        }

        stage('Update Manifests in dlink-manifests') {
            when {
                expression { env.SERVICES_TO_BUILD && env.SERVICES_TO_BUILD.trim() != "" }
            }
            steps {
                script {
                    echo "🔍 SERVICES_TO_BUILD: ${env.SERVICES_TO_BUILD}"
                    echo "🔍 VERSION_MAP: ${env.VERSION_MAP}"

                    // (1) 서비스명 -> manifest patch 파일 매핑
                    def patchMap = [
                        "api-gateway":      "gateway-patch.yaml",
                        "auth-service":     "auth-patch.yaml",
                        "alcohol-service":  "alcohol-patch.yaml",
                        "highball-service": "highball-patch.yaml",
                        "review-service":   "review-patch.yaml",
                        "pairing-service":  "pairing-patch.yaml",
                        "next-app":         "next-patch.yaml"
                    ]

                    // (2) Git clone & checkout
                    withCredentials([usernamePassword(credentialsId: 'github-access', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh """
                        rm -rf dlink-manifests
                        git clone https://\$GIT_USER:\$GIT_PASS@github.com/ACS7th/dlink-manifests.git
                        cd dlink-manifests
                        git checkout staging
                        git config user.name "dealim"
                        git config user.email "dealimmmm@gmail.com"
                        """

                        // (3) 버전 맵을 `env.VERSION_MAP`에서 추출
                        def versionMap = [:]
                        env.VERSION_MAP.split(",").each { entry ->
                            def parts = entry.split(":")
                            if (parts.length == 2) {
                                versionMap[parts[0]] = parts[1]
                            }
                        }

                        // (4) 빌드된 이미지 정보 기반으로 manifest 업데이트
                        env.SERVICES_TO_BUILD.split(" ").each { service ->
                            def patchFile = patchMap[service]
                            def currentVersion = versionMap[service]

                            if (patchFile && currentVersion) {
                                echo "🔄 ${patchFile} 업데이트 중 (버전: ${currentVersion})"

                                sh """
                                sed -i 's|image: ${HARBOR_URL}/dlink/${service}:.*|image: ${HARBOR_URL}/dlink/${service}:${currentVersion}|' dlink-manifests/overlays/production/patches/${patchFile}
                                """
                            } else {
                                echo "⚠️ ${service}에 대한 패치 파일 또는 버전 정보 없음"
                            }
                        }

                        // (5) Git commit & push
                        sh """
                        cd dlink-manifests
                        git add overlays/production/patches
                        git diff --cached --quiet || (git commit -m "Update image versions for CI" && git push origin staging)
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build & push to Harbor, and manifest update completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}

