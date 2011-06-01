/**
  * It's a simple benchmarker thats enable you test any kind of request, so you could test a simple ip with many hosts,
  * we are using it feature to do an nginx benchmark with many "servers" (like apache VirtualHost) 
 */

var http = require('http');
var bench =  require('./benchmark.js');

var result = {
    launched:0,
    finished:0,
    ok:0,
    failed:0,
    time:0
}

var start = new Date();
var timeout=1;
var lastSeccond=0;

/**
 * Prepare and launch the test
 */
for(var i=0; i<bench.data.requests; i++){
    setTimeout(doRequest(i % bench.data.urls.length),timeout);
    result.launched++;
    lastSeccond++;
    if(lastSeccond>=bench.data.throughput){
        lastSeccond=0;
        timeout+=1000
    }
}

/**
  * Check each miliseccond if the request has finished
  */
setInterval(
    function(){
        if(result.finished>=result.launched){
            var time=new Date()-start;
            result.time=new Date()-start+" ms";
            result.throughput=Math.round((result.ok / time)*1000)+" req/s"
            console.log(JSON.stringify(result))
            clearInterval(this);
        }
    },1);

/**
 * Execute the request using async calls
 */
function doRequest(urlIndex){
    http.request(bench.data.urls[urlIndex],function(res){
       result.finished++;
       if(res.statusCode<200 || res.statusCode>209){
        result.failed++;
       }else{
        result.ok++;
       }
       
       res.on('data', function(chunk) {  
       });
       res.on('end', function(end){
       });
       res.on('error', function(error){
       });    
    }).end();
}
