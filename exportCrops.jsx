// https://ASKproduKtion.com
// Copyright (c) 2024 >> Andrew S Klug // ASKproduKtion
// Licensed under the Apache License, Version 2.0 (the "License"); this file may not be used except in compliance with the License, a copy of which is available at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

// Set path for the folder containing PSD input files
var inputFolderPath = "/Users/ask/Desktop/Ready For Cropping"; // ADJUST AS NEEDED

// Set paths for the output folders containing exported crops
var exportFolderPaths = [
    "/Users/ask/Desktop/Crops 1x1", // ADJUST AS NEEDED
    "/Users/ask/Desktop/Crops 3x4", // ADJUST AS NEEDED
    "/Users/ask/Desktop/Crops 16x9" // ADJUST AS NEEDED
];

// Function to create output folders if they do not exist
function createOutputFolders() {
    for (var i = 0; i < exportFolderPaths.length; i++) {
        var outputFolder = new Folder(exportFolderPaths[i]);
        if (!outputFolder.exists) {
            outputFolder.create();
        }
    }
}

// Function to process each PSD input file in the folder
function processFiles(folder) {
    var files = folder.getFiles();

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // Check if it's a PSD file
        if (file instanceof File && file.name.match(/\.(psd)$/i)) {
            // Open the PSD input file
            var doc = app.open(file);
        
            // Loop through cropping paths
            var croppingPathNames = ["1x1", "3x4", "16x9"];
            for (var j = 0; j < croppingPathNames.length; j++) {
                // Name cropped output file
                var outputFileName = file.name.replace(/\.[^.]+$/, "") + "_" + croppingPathNames[j];

                // Duplicate the PSD input file
                var dupDoc = doc.duplicate(outputFileName);

                // Get the name of path
                var croppingPath = dupDoc.pathItems.getByName(croppingPathNames[j]);

                // Select cropping path
                croppingPath.makeSelection();

                // Crop to selection
                var idCrop = charIDToTypeID( "Crop" );
                executeAction( idCrop, undefined, DialogModes.NO );

                // Save as JPG without prompting
                var outputFileNameExt = outputFileName + ".jpg";
                var outputFile = new File(exportFolderPaths[j] + "/" + outputFileNameExt);
                var options = new JPEGSaveOptions();
                options.quality = 12; // Highest quality
                dupDoc.saveAs(outputFile, options, true);

                // Close the duplicate document without saving changes
                dupDoc.close(SaveOptions.DONOTSAVECHANGES);
            }

            // Close the input PSD file without saving changes
            doc.close(SaveOptions.DONOTSAVECHANGES);
        }

        // If it's a folder, recursively process its contents
        if (file instanceof Folder) {
            processFiles(file);
        }
    }
}

// Call the function to create output folders if they do not exist
createOutputFolders();

// Call the function to process the PSD input files
var folder = new Folder(inputFolderPath);
processFiles(folder);