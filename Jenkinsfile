
import static groovy.json.JsonOutput.toJson;
serverURL = "https://elementmanager2.pr.rightnow.com/AgentWeb"
extensionName = "ReportApp"
pipeline {
    agent any
    stages {
        stage('Pull extension from Git') {
            steps {
                script {
                echo 'Pulling..'

                dir("ReportApp") {
                    sh "rm -Rf ReportApp.zip"
                    
                }
                echo "start zipping"
                sh "rm -Rf ReportApp.zip"
                zip zipFile: "ReportApp.zip", archive: true, dir: "ReportApp"
                echo "zipping done"
                }
            }
        }
        stage('Upload to site') {
            steps {
                script {
                    echo 'Get Auth Token..'
                    def token = getAuthToken("Agent1", "Welcome1", "https://elementmanager2.pr.rightnow.com/cgi-bin/elementmanager2.cfg")
                    def zip = readFile(file: "${extensionName}.zip", encoding: "Base64")
                    //def response = uploadZip(zip, extensionName, token)
                    try{ 
                        pkgStatus = uploadZip(zip, extensionName, token)
                        status = 0
                        while (status != '5' && status != '15') {
                            sleep(1)
                            echo "Checking Import status"
                            pkgStatus = getImportPackageStatus(pkgStatus.id, token)
                            status = pkgStatus.status.code
                        }
                        if (status != '5') {
                            error "Package upload failed"
                        }
                        sleep(10)
                        echo "Starting deploy"
                        deployImportPackage(pkgStatus.id, token)
                        echo "Deploy complete"
                    }catch(Exception errorMessage){
                        error errorMessage.getMessage()
                        throw errorMessage
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying..'
                
            }
        }
    }
}
def getImportPackageStatus(id, token) {
    def response = httpRequest  acceptType: 'APPLICATION_JSON',ignoreSslErrors:true, httpMode: 'GET', url: "${serverURL}/api/elementmanager/import/EMPackages/${id}", customHeaders: [[name: 'USERSESSION', value: token], [name: 'Cookie', value: "USERSESSION=${token}"]]
    echo response.content
    return parseJSON(response.content)
}

def deployImportPackage(id, token) {
    payload = """ {
        "action": "import",
        "id": "${id}"
    }
    """
    echo payload
    response = httpRequest acceptType: 'APPLICATION_JSON', contentType: 'APPLICATION_JSON', ignoreSslErrors:true, httpMode: 'PATCH', requestBody: payload, url: "${serverURL}/api/elementmanager/import/EMPackages", customHeaders: [[name: 'USERSESSION', value: token], [name: 'Cookie', value: "USERSESSION=${token}"]]
    echo response.content
    return parseJSON(response.content)
}

def getAuthToken(user, pass, interfaceUrl) {
    def authString = "{\"username\": \"${user}\", \"password\": \"${pass}\", \"interfaceUrl\":\"${interfaceUrl}\"}"
    

    response = httpRequest httpsProxy: 'http://www-proxy-idc.in.oracle.com:80', acceptType: 'APPLICATION_JSON', contentType: 'APPLICATION_JSON', ignoreSslErrors:true, httpMode: 'POST', requestBody: authString, url: "${serverURL}/api/securityservice/authentication/authToken"
    def result = parseJSON(response.content)
    //echo "result is "
    return result.token
}

def parseJSON(json) {
    echo "in parse"
    return new groovy.json.JsonSlurperClassic().parseText(json)
    echo "out parse"
}

def uploadZip(zip, name, token) {
    req = """
        {"packageContent":"${zip}", "name":"${name}", "importType":"CustomImport", "attributes": {
      "customImportAttributes":{
          "itemName": "${name}",
          "itemType": "BrowserExtension",
          "extensionAttributes":{
              "extensionType": "Console",
              "extensionInitFile": "index.html"}}}}
        """
    echo req
    response = httpRequest httpsProxy: 'http://www-proxy-idc.in.oracle.com:80', acceptType: 'APPLICATION_JSON', contentType: 'APPLICATION_JSON',ignoreSslErrors:true, httpMode: 'POST', requestBody: req, url: "${serverURL}/api/elementmanager/import/EMPackages", customHeaders: [[name: 'USERSESSION', value: token], [name: 'Cookie', value: "USERSESSION=${token}"]]

    
    return parseJSON(response.content)
}
