const axios = require('axios').default;
const soap = require('soap');

(async() => {

    const port = '1234';
    const baseURL = "http://localhost:" + port;

    // Read the incoming messages from parent
    process.on("message", async (message) => {

        /*
        const data = {
            text: message.data.data.text
        };

        axios.post(baseURL + "/messages", data);
        */

        // Soap Request

        const URL = '../CBE.wsdl';

        // Variables
        const longitude = 1;
        const latitude = 1;
        const associtationCode = 1; // Sor Operatoru tarif eden numara
        const text = message.data.data.text;


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

                console.log('CBS Response: ');
                console.log(result);

            });

        });

        // End of Soap Request

    });

})();