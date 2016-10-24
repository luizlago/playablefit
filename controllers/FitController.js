var google = require('googleapis');
var fitApi = google.fitness('v1');
var plus = google.plus('v1');

var API_KEY = 'AIzaSyAqrh54LshAen-T3gICnL5Q2_Ku7Z812Sc';
console.log('fit loaded');

var fit = function(app){
    app.post('/getListData', function (req, res) {
        console.log('getListData');
        fitApi.users.dataSources.list({
            userId: req.body.userId, 
            auth:req.body.accessToken, 
            key: API_KEY 
        }, function(err, result) {
            console.log(result);
            if(err){
                return res.status(500).send(err);
            } else{
                return res.status(200).send(result);
            }
        });
    });
}



module.exports = fit;