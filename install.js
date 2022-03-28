var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'puzzle2',
  description: 'Telegram Уведомление о токах',
  script: require('path').join(__dirname, 'master.js'),
  env:{
    name: "NODE_ENV",
    value: "production"
  }
});

//svc.logOnAs.domain = 'mydomain.local';
//svc.logOnAs.account = 'phdmaster';
//svc.logOnAs.password = 'm@st3r123';

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

// Just in case this file is run twice.
svc.on('alreadyinstalled',function(){
  console.log('This service is already installed.');
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start',function(){
  console.log(svc.name+' started!');
});

// Install the script as a service.
svc.install();