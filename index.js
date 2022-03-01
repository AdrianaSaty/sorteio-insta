//https://www.npmjs.com/package/dotenv
require('dotenv').config()

//https://www.npmjs.com/package/instatouch
const instaTouch = require('instatouch');

//https://nodejs.org/api/fs.html
const fs = require('fs')

/**
 * This function is responsible of writing the content of the golden ticket
 * to a file in the system
 * 
 * @property {object} content - Content of the golden ticket
 */
function writeGoldenTicket(content) {
    fs.writeFile('goldenTicket.json', JSON.stringify(content, null, 2), function (err) {
        if (err) console.error(err);
    })
}

/**
 * This function picks a winner between all the commenting participants
 * 
 * @property {array} participants - Array of Objecs with participants infos
 * @returns {object} - Info About the winner of the raffle and the golden ticket number
 */
function pickWinner(participants) {
    const allParticipants = participants.length

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    const pickedTicket = Math.floor(Math.random() * allParticipants);

    const pickedWinner = participants[pickedTicket]

    const goldenTicket = { ...pickedWinner, ticketNumber: pickedTicket }
    return goldenTicket
}

/**
 * This function searchs for all the comments in a specified post
 * 
 * @property {string} postId - The post Id to search for
 * @returns {array} - All the comments found in the specified post
 */
async function getAllParticipants(postId) {
    try {
        const options = {
            session: process.env.INSTAGRAM_SESSION_ID,
            count: 1400
        };
        const { collector } = await instaTouch.comments(postId, options);
        return collector
    } catch (error) {
        console.log(error);
    }
}

/**
 * Main execution function
 */
async function main() {
    const participants = await getAllParticipants('CZz0MqJFDML');
    const goldenTicket = pickWinner(participants);
    writeGoldenTicket(goldenTicket);
}

main();