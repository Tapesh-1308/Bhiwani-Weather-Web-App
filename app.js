const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal)=>{
    let temperature = tempVal.replace('{%tempval%}', Math.round((orgVal.main.temp - 273.15)*Math.pow(10,2))/Math.pow(10,2));
    temperature = temperature.replace('{%tempmin%}', Math.round((orgVal.main.temp_min - 273.15)*Math.pow(10,2))/Math.pow(10,2));
    temperature = temperature.replace('{%tempmax%}', Math.round((orgVal.main.temp_max - 273.15)*Math.pow(10,2))/Math.pow(10,2));
    temperature = temperature.replace('{%location%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    // temperature = temperature.replace('{%tempstatus%}', orgVal.weather[0].main);
    return temperature
}
const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Bhiwani&appid=80af81d17193da7362954ec2cdd7d32c')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                //   console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
                
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});

server.listen(2000, "127.0.0.1");