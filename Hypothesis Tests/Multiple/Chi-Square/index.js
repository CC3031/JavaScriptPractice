import {chiSquareTable} from "./chiSquareTable.js";

let result = "";

function input() {
    const data = {
        o: [15,12,9,9,15] // row of data
    };
    data.n = data.o.length;
    data.e = (data.o.reduce((total,num) => total + num, 0) / data.n);

    // Please enter alpha:
    const alpha = 0.05;
    
    return {data, alpha}
}

function main() {
    const {data, alpha} = input();
    claims();
    alphaFunction(alpha);
    const testStat = testStatistic(data);
    const critValue = criticalValue(data.n - 1, alpha);
    evaluateNull(testStat, critValue);
    console.log(result);
}

function claims() {
    result += `Step 1:\n\tH0: x2 does fit the distribution\n\t`;
    result += `H1: x2 does not fit the distribution\n`;
}

function alphaFunction(alpha) {
    result += `Step 2: alpha = ${alpha}\n`;
}

function testStatistic(data) {
    const oMinusESquaredArray = data.o.map(num => (num - data.e)**2);
    console.log(oMinusESquaredArray);
    const sum = oMinusESquaredArray.reduce((total, num) => total + num, 0);
    const chiSquare = sum / data.e;
    result += `Step 3: test statistic = ${chiSquare}\n`;
    return chiSquare;
}

function criticalValue(df, alpha) {
    const critValue = chiSquareTable[df][alpha];
    result += `Step 4: critical value = +${critValue}\n`;
    return critValue;
}

function evaluateNull(testStat, critValue) {
    // reject the null if the test statistic is outside of the critical values
    const rejectNull = critValue < testStat;
    const suffStr = rejectNull ? 'is' : 'is not';
    const rejectStr = rejectNull ? 'Reject' : 'Failed to reject';

    result += `Step 5: ${rejectStr} null hypothesis\n\tThere ${suffStr} sufficient evidence to reject the claim.`;
    return;
}

main();