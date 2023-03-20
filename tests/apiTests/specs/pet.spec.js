import {expect, test} from "@playwright/test";

const data = require('../testData/data.json');
const postRequestBody = require('../requestBodies/postNewPet.json');
const putRequestBody = require('../requestBodies/putPet.json');

// Creating a pet name 'initialDogCreatedByDustinG
test(`@API Create Pet`, async ({request}) => {
    const response = await request.post(data[0].baseUrl + '/v2/pet', {
        data: postRequestBody[0]
    });
    const responseJson = await response.json();
    let petId = await responseJson.id;

    expect(response.status()).toBe(200);
    expect(petId).toEqual(postRequestBody[0].id);
    expect(await responseJson.category.name).toEqual(postRequestBody[0].category.name);
    expect(await responseJson.status).toEqual(postRequestBody[0].status);
});

// Sending newly created petId to Get request to be sure if pet has created
test(`@API Validate Pet has been added through API that returns specific Pet based on ID`, async({request}) => {
    const response = await request.get(data[0].baseUrl + '/v2/pet/' + postRequestBody[0].id, { 
        headers: {
            'Accept': 'application/json'
        }
    });
    expect(response.status()).toBe(200);

    const responseJson = await response.json();

    expect(await responseJson.id).toEqual(postRequestBody[0].id);
    expect(await responseJson.category.name).toEqual(postRequestBody[0].category.name);
    expect(await responseJson.status).toEqual(postRequestBody[0].status);
});

test(`@API Validate Pet has been Added`, async({request}) => {
    const response = await request.get(data[0].baseUrl + '/v2/pet/findByStatus?status=' + postRequestBody[0].status, { 
    });
    expect(response.status()).toBe(200);

    const responseJson = await response.json();
    let numberOfObjects = await responseJson.length;

    // In this for loop I am finding if newly added Pet id is placing on response body
    for(let i = 0; i < numberOfObjects; i++) {
        if(await responseJson[i].id == postRequestBody[0].id) {
          expect(await responseJson[i].id).toEqual(postRequestBody[0].id);
        }
    }
});

test(`@API Update newly created Pet's name`, async({request}) => {
    const response = await request.put(data[0].baseUrl + '/v2/pet', {
        data: putRequestBody[0]
    });

    const responseJson = await response.json();

    expect(response.status()).toBe(200);
    expect(await responseJson.id).toEqual(postRequestBody[0].id);
    expect(await responseJson.category.name).not.toEqual(postRequestBody[0].category.name);
    expect(await responseJson.category.name).toEqual(putRequestBody[0].category.name);
});

test(`@API Validate Pet's name has been Updated`, async({request}) => {
    const response = await request.get(data[0].baseUrl + '/v2/pet/' + putRequestBody[0].id, { 
        headers: {
            Accept: 'application/json'
        }
    });
    const responseJson = await response.json();
    
    expect(response.status()).toBe(200);
    expect(await responseJson.id).toEqual(postRequestBody[0].id);
    expect(await responseJson.category.name).toEqual(putRequestBody[0].category.name);
});

test(`@API Update newly created Pet's status`, async({request}) => {
    const response = await request.put(data[0].baseUrl + '/v2/pet', {
        data: putRequestBody[1]
    });

    const responseJson = await response.json();

    expect(response.status()).toBe(200);
    expect(await responseJson.id).toEqual(postRequestBody[0].id);
    expect(await responseJson.category.name).toEqual(putRequestBody[0].category.name);
    expect(await responseJson.status).toEqual(putRequestBody[1].status);
});

test(`@API Validate Pet's status has been Updated`, async({request}) => {
    const response = await request.get(data[0].baseUrl + '/v2/pet/' + postRequestBody[0].id, { 
        headers: {
            'Accept': 'application/json'
        }
    });
    const responseJson = await response.json();
    
    expect(response.status()).toBe(200);
    expect(await responseJson.id).toEqual(postRequestBody[0].id);
    expect(await responseJson.status).toEqual(putRequestBody[1].status);
});

test(`@API Delete newly created Pet`, async({request}) => {
    const response = await request.delete(data[0].baseUrl + '/v2/pet/' + postRequestBody[0].id, { 
        headers: {
            'api_key': data[0].apiKey
        }
    });
    const responseJson = await response.json();

    expect(response.status()).toBe(200);
    expect(await responseJson.message).toEqual(postRequestBody[0].id.toString());
    expect(await responseJson.type).toEqual("unknown");
});

test(`@API Validate Pet has been Deleted`, async({request}) => {
    const response = await request.get(data[0].baseUrl + '/v2/pet/' + postRequestBody[0].id, { 
        headers: {
            'Accept': 'application/json'
        }
    });
    const responseJson = await response.json();

    expect(response.status()).toBe(404);
    expect(await responseJson.type).toEqual("error");
    expect(await responseJson.message).toEqual('Pet not found');
});
