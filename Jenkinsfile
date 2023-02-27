// sample jenkins file
import static groovy.json.JsonOutput.toJson;
//serverURL = "https://eventtriggernew.pr.rightnow.com/AgentWeb"
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
                    //zip zipFile: 'ReportApp.zip'
                zip zipFile: "ReportApp.zip", archive: true, dir: "ReportApp"
                    //sh "find . -type f -print | zip ReportApp.zip -@"
                echo "zipping done"

                // sh """
                //     cd ReportApp
                //     cd
                //     IF EXIST ReportApp.zip DEL /F ReportApp.zip
                //     find . -type f -print | zip ReportApp.zip -@
                // """.stripIndent().trim()
                //bat "IF EXIST ReportApp.zip DEL /F ReportApp.zip"
                //bat "cd ReportApp"
                //echo "CD after ReportApp"
                //bat "cd"
                //bat "7z a -tzip ReportApp.zip"
                //bat "git clone  http://phoenix216798.appsdev1.fusionappsdphx1.oraclevcn.com:3000/vishnu/Extensions.git"
                }
            }
        }
        stage('Upload to site') {
            steps {
                script {
                echo 'Get Auth Token..'
                //def token = getAuthToken("Agent1", "Welcome1", "https://eventtriggernew.pr.rightnow.com/cgi-bin/eventtriggernew.cfg")
                def token = getAuthToken("Agent1", "Welcome1", "https://elementmanager2.pr.rightnow.com/cgi-bin/elementmanager2.cfg")
                def zip = readFile(file: "${extensionName}.zip", encoding: "Base64")
                //def zip = "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"
                def response = uploadZip(zip, extensionName, token)
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
    //retry(2) {
    response = httpRequest httpsProxy: 'http://www-proxy-idc.in.oracle.com:80', acceptType: 'APPLICATION_JSON', contentType: 'APPLICATION_JSON',ignoreSslErrors:true, httpMode: 'POST', requestBody: req, url: "${serverURL}/api/elementmanager/import/EMPackages", customHeaders: [[name: 'USERSESSION', value: token], [name: 'Cookie', value: "USERSESSION=${token}"]]
    //if (response.status != 200) {
    //    echo "some-failure-prone-script failed"
    //    echo response.content
    //    }
    //}
    
    return parseJSON(response.content)
}
