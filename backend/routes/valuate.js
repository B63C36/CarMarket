const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk'); //anthropic sdk connects to the claude AI api

//creates the anthropic client usinf api key from .env
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

//post recives car details and returns price estimates 
router.post('/', async (req, res) => {
  //pulls all car details out the request body
  const { make, model, year, mileage, fuelType, transmission, bodyType, engineSize, trim, condition, colour, previousOwners, serviceHistory, nct, notes } = req.body;

  try {
    //sends message to claude with the car detials 
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6', //model used 
      max_tokens: 1024, //max length of the repsonse
      messages: [
        {
          role: 'user',
          //the promt used
          content: `You are a used car valuation expert in Ireland. Estimate the market value of the following car:

Make: ${make}
Model: ${model}
Year: ${year}
Mileage: ${mileage} km
Fuel Type: ${fuelType}
Transmission: ${transmission}
Body Type: ${bodyType}
Engine Size: ${engineSize}
Trim/Edition: ${trim}
Condition: ${condition}
Colour: ${colour}
Previous Owners: ${previousOwners}
Service History: ${serviceHistory}
NCT Status: ${nct}
Additional Notes: ${notes}

Respond with:
1. Estimated price range in euros
2. Recommended asking price
3. Short explanation
4. Factors increasing value
5. Factors decreasing value
6. Tips for getting a better selling price

Keep the response concise and relevant to the Irish used car market.`
        }
      ]
    });

    //sned the response to the front end
    res.json({ result: message.content[0].text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Valuation failed' });
  }
});

module.exports = router;