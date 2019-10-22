
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
var lineReader = require('line-reader');
var fs = require('fs');

var inputData = [];
var classificationData = [];
var model;

/* model example of zone
var zoneInfo = {
    latitude : 5,
    longitude : 16,
    precipitation : 2,
    wind : 1,
    danger : 0 <- means no alert, 1 means alert
};
In the data.txt represented as 5,16,2,1,0
*/

//tf.loadLayersModel returns a promise so it needs a then and a catch in to order to wait until it resolves
loadedModel = tf.loadLayersModel("model.json");
loadedModel.then(function(result){
	//If the model already exits compile it and use it
	model = result;
	model.compile({loss: 'meanSquaredError', optimizer: 'rmsprop'});
	train();
}).catch(function(error) {
	//In case model does not exist, create it defining its properties (only for first time execution)
	model = tf.sequential();
	model.add(tf.layers.dense({units: 4, activation: 'sigmoid',inputShape: [4]}));
	model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
	model.compile({loss: 'meanSquaredError', optimizer: 'rmsprop'});
	train();
});

train();

async function train() {

	await readData();
	
	const training_data = tf.tensor2d(inputData);
	const target_data = tf.tensor2d(classificationData);

	for (let i = 1; i < 10; ++i) {
		var h = await model.fit(training_data, target_data, {epochs: 30});
		console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
	}
}

async function readData(){
	var dataPath ='./meteo_data/data.txt';
	return new Promise((resolve) => {
		lineReader.eachLine(dataPath, function(line_, last) {
			//Fist number is the input
			line = line_.split(",");
			line = line.map(number => number = parseInt(number,10)); //Convert from char to number
			inputData.push([line[0],line[1],line[2],line[3]]);
			classificationRow = [line[4]];
			classificationData.push(classificationRow);
			if(last){
				resolve(); //method called when promess executes succesfully
			}
		});
	});
}

async function predictValues(zoneInfo){
	path = '/home/ubuntu/meteo-prediction/nn_data/meteo_prediction.txt';
	predictionValues = [[zoneInfo.latitude, zoneInfo.longitude, zoneInfo.precipitation, zoneInfo.wind]];
	result = model.predict(tf.tensor2d(predictionValues));
	result.array().then(array => {
		array.map((row,index) => {
			fs.appendFile(path,row) + '\n',function(){
			};
		});
	});
}
