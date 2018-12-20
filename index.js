const fs = require('fs');
const path = require('path');
const svgoPlugin = require('svgo');
const readline = require('readline');

var svgo = new svgoPlugin({
    plugins: [ 
        {
            cleanupAttrs: true,
          }, {
            removeDoctype: false,
          },{
            removeXMLProcInst: false,
          },{
            removeComments: false,
          },{
            removeMetadata: false,
          },{
            removeTitle: false,
          },{
            removeDesc: false,
          },{
            removeUselessDefs: false,
          },{
            removeEditorsNSData: false,
          },{
            removeEmptyAttrs: false,
          },{
            removeHiddenElems: false,
          },{
            removeEmptyText: false,
          },{
            removeEmptyContainers: false,
          },{
            cleanupEnableBackground: false,
          },{
            convertStyleToAttrs: false,
          },{
            convertColors: false,
          },{
            convertPathData: false,
          },{
            convertTransform: false,
          },{
            removeUnknownsAndDefaults: false,
          },{
            removeNonInheritableGroupAttrs: false,
          },{
            removeUselessStrokeAndFill: false,
          },{
            removeUnusedNS: false,
          },{
            cleanupIDs: false,
          },{
            cleanupNumericValues: false,
          },{
            moveElemsAttrsToGroup: false,
          },{
            moveGroupAttrsToElems: false,
          },{
            collapseGroups: false,
          },{
            removeRasterImages: false,
          },{
            mergePaths: false,
          },{
            convertShapeToPath: false,
          },{
            sortAttrs: true,
          },{
            removeViewBox: false,
          },{
            removeDimensions: true,
          }
    ]
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) {
            console.log("Enters error 1");
            return done(err); 
        }
        var pending = list.length;
        if (!pending) {
            return done(null, results); 
        }
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

rl.question('Enter the root path of your machine (for ex: \"C:\\Users\\XIAOMI\\Desktop\\Work\\Fiverr\\nodejs-script-svg\") ? ', (url) => {
    console.log(`Your answer: ${url}`);
    // You can use this as an example :    C:\Users\XIAOMI\Desktop\Work\Fiverr\nodejs-script-svg\folder
    
    walk(url, function(err, results) {
        if (err) {
            console.log("Error on walk " + err);
            throw err;
        }
        console.log(results);
        results.forEach(function(svgPath){

            fs.readFile(svgPath, 'utf8', function(err, data) {

                if (err) {
                    console.log("Error on file loading: " + err);
                    throw err;
                }

                svgo.optimize(data, {path: svgPath}).then(function(result) {
                    console.log("Finished optiomizing file.");
                    fs.writeFileSync(svgPath, result.data); 
                });
            });

        })
        rl.close();
    });
});



