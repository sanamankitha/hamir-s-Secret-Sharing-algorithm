const fs = require('fs');
const readline = require('readline');

// Function to convert a number from a given base to decimal
function convertToDecimal(value, base) {
    return parseInt(value, base);
}

// Function to perform Lagrange interpolation and find the constant term (c)
function lagrangeInterpolation(points) {
    let k = points.length;
    let constantTerm = 0;

    for (let i = 0; i < k; i++) {
        let term = points[i].y;
        let denominator = 1;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                term *= -points[j].x;
                denominator *= (points[i].x - points[j].x);
            }
        }
        constantTerm += term / denominator;
    }
    return Math.round(constantTerm);
}

// Read JSON file dynamically
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter JSON filename: ", function(filename) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            rl.close();
            return;
        }

        const jsonData = JSON.parse(data);

        // Check if the JSON file contains multiple test cases (array format)
        if (!Array.isArray(jsonData)) {
            console.error("Invalid JSON format. Expected an array of test cases.");
            rl.close();
            return;
        }

        jsonData.forEach((testCase, index) => {
            const { n, k } = testCase.keys;
            let points = [];
            let count = 0;

            // Extract and decode values
            for (let key in testCase) {
                if (key !== "keys" && count < k) {
                    let x = parseInt(key);
                    let base = parseInt(testCase[key].base);
                    let y = convertToDecimal(testCase[key].value, base);
                    points.push({ x, y });
                    count++;
                }
            }

            // Compute constant term
            const constant = lagrangeInterpolation(points);
            console.log(`Secret Constant (c) for Test Case ${index + 1}:`, constant);
        });

        rl.close();
    });
});
