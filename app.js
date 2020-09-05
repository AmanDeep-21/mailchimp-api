const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const path = require('path');

const app = express();

// BodyParser middleware

app.use(bodyParser.urlencoded({extended: true}));

// Static folder

app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
    const { firstName, lastName, email } = req.body
    
    console.log(req.body);

    // to check fields are not empty
    if(!firstName || !lastName || !email) {                         
        res.redirect('/fail.html');
        return;
    }

    mailchimp.setConfig({
        apiKey: 'YOUR_API_KEY_HERE',                // to get API Key, click on your profile name -> ACCOUNT -> EXTRAS Dropdown -> API keys
        server: 'YOUR_SERVER_PREFIX',               // it'll be 'us17' for the given url -> https://us17.admin.mailchimp.com/lists/
    });

    // To test if everything is working fine or not, if response comes to be { health_status: "Everything's Chimpy!"} ,
    //  then things are working out well.

    // async function run(){
    //     try{
    //         const response = await mailchimp.ping.get();
    //         console.log(response);
    //     }
    //     catch(err){
    //         console.log(err);
    //     }
    // }

    // run();


    // to add a contact into the list 
    const listId = 'YOUR_LIST_ID_HERE';             // it is not the id from url, https://us17.admin.mailchimp.com/lists/members/?id=19144862, but 
                                                    // you'll find it at https://us17.admin.mailchimp.com/lists/ , then click on the dropdown beside 
                                                    // stats, click on settings, scroll to bottom, you'll see unique id for audience, that's your list id.

    async function run() {
        try{
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            });

            console.log(`Successfully added contact as an audience member. The contacts id is ${response.id}`);
            res.redirect('/success.html');
        }
        catch(err){
            console.log(err);
            res.redirect('/fail.html');
        }
    }

    run();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server is running at port ${PORT}`));

