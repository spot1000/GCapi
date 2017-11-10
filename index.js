const express = require('express');
const getDayOfYear = require('date-fns/get_day_of_year')
const addSeconds = require('date-fns/add_seconds');
const addHours = require('date-fns/add_hours')

const port = 8888

const app = express();

const meanVelocity = 2 * Math.PI / 365.24;
const obliquity = 23.44 * Math.PI / 180;

function toRads(angle) {
    return angle * (Math.PI / 180)
}

function equationOfTime(day) {
    let approxAngle = meanVelocity * ((day + 10) % 365);
    let correctedAngle = approxAngle + 0.0336 * Math.sin(toRads(meanVelocity)) * ((day - 2) % 365);
    let angleDifference = Math.atan(Math.tan(toRads(correctedAngle)) / Math.cos(toRads(obliquity)));
    angleDifference = (approxAngle - angleDifference) / Math.PI;
    return 43200 * (angleDifference - parseInt(angleDifference + 0.5))
}

function solarTime () {
    const time = new Date();
    const days = getDayOfYear(time);
    const longitude = -52.7050220;
    const eot = equationOfTime(days);
    return addSeconds(addHours(time, 2.5), (longitude * 240 + eot));
}

console.log(solarTime())

app.get('/', (req, res) => {
    // let solarTime = solarTime();
    res.send(solarTime())
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});