const soap = require('soap');

const URL = '../CBE.wsdl';

// Variables
const longitude = 1;
const latitude = 1;
const associtationCode = 1;
const text = 'deneme text 123';



const contentList = [
    {
        text: text, 
        lang: 'tr'
    }
];

const coordinateList = [
    {
        latitude: latitude,
        longitude: longitude
    }
];

const targetDetail = {
    polygon: true,
    coordinates: coordinateList
};

const params = {
    alertId: 'long',
    category: 'TEST',
    contents: contentList,
    voiceAlert: false,
    associtationCode: associtationCode, 
    repetetive: false, 
    target: targetDetail
}

soap.createClient(URL, (err, client) => {

    if (err)
    {
        console.error(err);
    }

    console.log(client.describe());

    client.Create_Broadcast(params, (err, result) => {

        if (err)
        {
            console.error(err);
        }

        console.log(result);

    });

});