
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
var lineReader = require('line-reader');
var fs = require('fs');

var inputData = [];
var classificationData = [];
var model;

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
	model.add(tf.layers.dense({units: 10, activation: 'sigmoid',inputShape: [4]}));
	model.add(tf.layers.dense({units: 4, activation: 'sigmoid',inputShape: [10]}));
	model.compile({loss: 'meanSquaredError', optimizer: 'rmsprop'});
	train();
});

train(); // TODO remove this

async function train() {

	await readData();
	
	//This commented lines are the structure of arrays compatibles with the neural network model used
	//const training_data = tf.tensor2d([[0],[1],[2],[3],[4]]);
	//const target_data = tf.tensor2d([[0,0,0],[0,0,1],[0,1,0],[1,0,0],[1,0,0]]);
	
	const training_data = tf.tensor2d(inputData);
	const target_data = tf.tensor2d(classificationData);

	for (let i = 1; i < 400; ++i) {
		var h = await model.fit(training_data, target_data, {epochs: 30});
		console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
	}
	//After every training, persist the model with its weigths
	//model.save("file:///home/ubuntu/nn_model");
	predictValuesAndPersist();
	log('\n' + new Date() + ' model training completed.');
}

async function readData(){
	return new Promise((resolve) => {
		lineReader.eachLine('./nn_data/data.txt', function(line_, last) {
			//Fist number is the input
			line = line_.split(",");
			line = line.map(number => number = parseInt(number,10)); //Convert from char to number
			inputData.push([line[0],line[1],line[2],line[3]]);
			classificationRow = line[5];
			classificationData.push(classificationRow);
			if(last){
				resolve(); //method called when promess executes succesfully
			}
		});
	});
}

/*
async function predictValuesAndPersist(){
	path = '/home/ubuntu/meanderlust-rest/nn_data/prediction.txt';
	fs.unlinkSync(path); //clean file
	predictionValues = [[0],[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23]];
	result = model.predict(tf.tensor2d(predictionValues));
	result.array().then(array => {
		array.map((row,index) => {
			fs.appendFile(path,index + '-' + genres[getIndexOfMaxValue(row)] + '\n',function(){
			});
			log('\n' + index + '-' + genres[getIndexOfMaxValue(row)]);
		});
	});
}
*/

async function predictValues(zoneInfo){
	predictionValues = [[zoneInfo.latitude, zoneInfo.longitude, zoneInfo.precipitation, zoneInfo.wind]];
	result = model.predict(tf.tensor2d(predictionValues));
	result.array().then(array => {
		array.map((row,index) => {
			fs.appendFile(path,index + '-' + row) + '\n',function(){
				console.log(path, index + '-' + row);
			};
		});
	});
}

function log(message){
	fs.appendFile('/home/ubuntu/neural_network.log',message, (err) => {
	});
}

var zoneInfo = {
    latitude : 0,
    longitude : 0,
    precipitation : 0,
    wind : 0,
    danger : 0
};
