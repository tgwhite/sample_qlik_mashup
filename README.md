# Sample Qlik Mashup

## Intro
This repository contains an example Qlik Sense mashup. It uses node/express.js as a server and the Qlik ticket API for authentication. 

## Getting Started

### Virtual Proxy
Create a [virtual_proxy](https://help.qlik.com/en-US/sense/June2018/Subsystems/ManagementConsole/Content/create-virtual-proxy.htm) using Qlik's management console (the QMC). This virtual proxy should use ticket authentication and it should whitelist "localhost". It should also use a redirect url of "https://localhost:3000". Make sure to also add "https://localhost:3000" to your Access-Control-Allow-Origin header within the advanced section. 

### Stub HTML
Upload app_login.html (in this repository) to Qlik Sense's default content library. [Here](https://help.qlik.com/en-US/sense/June2018/Subsystems/ManagementConsole/Content/upload-objects-to-content-libraries.htm) is a how-to guide. 

### Export Qlik certificates
Follow this [guide](https://help.qlik.com/en-US/sense/June2018/Subsystems/ManagementConsole/Content/export-certificates.htm) to export certificates. Make sure to use a .pem format and do not use a password (this code does not expect a password). 

### Get and update this code
Use git to clone this repository. Open a command prompt in this location and run `npm install`

Then update this code: 
1. Go through this code and replace references to `usrem-csq.qliktech.com` to the url for your Qlik Sense engine. 
2. Update references to `ticket_proxy` to whatever prefix you choose for your virtual proxy.  
3. In server.js, change `QTSEL` to your user directory within Qlik (go to QMC > users if you don't know what yours is) and `csq` to your username. 
4. In server.js, change the path to your exported certificates. This should be as easy as updating "usrem-csq" to your machine name within the `certPath` variable definition. 

### Run the code
Run `npm start` within a command prompt and visit https://localhost:3000. You may get a warming about this site not being safe because it's using a self-signed certficate. Proceed anyway. 