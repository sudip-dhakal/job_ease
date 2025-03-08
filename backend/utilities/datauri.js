const DataUriParser = require( "datauri/parser.js");

const path = require( "path");

// Define the getDataUri function that takes a 'file' object as an argument
const getDataUri = (file) => {
    // Create a new instance of DataUriParser
    const parser = new DataUriParser();

    // Extract the file extension from the file's original name
    const extName = path.extname(file.originalname).toString();

    // Use the parser to generate a Data URI by formatting the file's extension and buffer
    return parser.format(extName, file.buffer);


    
}
module.exports = getDataUri;