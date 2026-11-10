import {tTable} from "../../tTable.js";

let result = "";

function userInput() {
    const data = {
        rowOne: [70,72,65,81,43,54,70,90,62,57],
        rowTwo: [80,70,72,80,51,72,85,85,52,60]
    };

    const claim = {
        equalTo: true, // muD = 0
        notEqualTo: false, // muD != 0
        greaterThan: false, // muD > 0
        lessThan: false // muD < 0
    };

    // Please enter alpha:
    const alpha = 0.05;
    
    return {data, claim, alpha};
}

function main() {
    const {data, claim, alpha} = userInput();
    const dataStatistics = processInputs(data);

    const signToUse = claims(claim);
    alphaFunction(alpha);
    const testStat = testStatistic(dataStatistics);
    const critValues = criticalValue(alpha, signToUse, dataStatistics.n - 1);

    evaluateNull(testStat, critValues, claim);
    
    console.log(result);

}

function processInputs(data) {
    let dataStatistics = {
        dBar: 0,
        muDiff: 0,
        sDiff: 0,
        n: data.rowOne.length
    };

    // for dBar
    let diffArray = [];
    for (let i = 0; i < data.rowOne.length - 1; i++) {
        diffArray.push(data.rowOne[i] - data.rowTwo[i]);
    }
    dataStatistics.dBar = diffArray.reduce((total, num) => total + num, 0) / diffArray.length;

    // for sDiff
    const squaredDiffArray = diffArray.map(num => (num - dataStatistics.dBar) ** 2);
    const sumSquaredDiffArray = squaredDiffArray.reduce((total, num) => total + num, 0);
    dataStatistics.sDiff = Math.sqrt(sumSquaredDiffArray / dataStatistics.n - 1);

    return dataStatistics;
}


function claims(claim) {
    result += `Step 1:\n\tH0: muD = 0\n\t`;

    switch (true) {
        case claim.equalTo || claim.notEqualTo:
            result += `H1: muD != 0\n`;
            return "=";
        case claim.greaterThan:
            result += `H1: muD > 0\n`;
            return ">";
        case claim.lessThan:
            result += `H1: muD < 0\n`;
            return "<";
    }
}

function alphaFunction(alpha) {
    result += `Step 2: alpha = ${alpha}\n`;
}

function testStatistic(dataStatistics) {
    let testStat = (dataStatistics.dBar - dataStatistics.muDiff) / (dataStatistics.sDiff / Math.sqrt(dataStatistics.n));
    result += `Step 3: test statistic = ${testStat}\n`;

    return testStat;
}

function criticalValue(alpha, signToUse, degreesOfFreedom) {
    let critValues = [];
    if (signToUse == "=" || signToUse == "!=") {
        critValues.push(-1 * tTable[degreesOfFreedom][alpha], tTable[degreesOfFreedom][alpha]);
        result += `Step 4: critical values = ${critValues[0]}, ${critValues[1]}\n`;
        return critValues;

    } else if (signToUse == ">") {
        critValues.push(tTable[degreesOfFreedom][alpha * 2]);
    } else {
        critValues.push(-1 * tTable[degreesOfFreedom][alpha * 2]);
    }

    result += `Step 4: critical value = ${critValues[0]}\n`;
    return critValues;
}

function evaluateNull(testStat, critValues, claim) {
    // reject the null if the test statistic is outside of the critical values
    let rejectNull;
    switch (true) {
        case claim.greaterThan:
            rejectNull = testStat >= critValues[0]
            break;
        case claim.lessThan:
            rejectNull = testStat <= critValues[0]
            break;
        case claim.notEqualTo || claim.equalTo:
            rejectNull = critValues[0] > testStat || testStat > critValues[1];
            break;
    }
    
    const suffStr = rejectNull ? 'is' : 'is not';
    const rejectStr = rejectNull ? 'Reject' : 'Failed to reject';

    result += `Step 5: ${rejectStr} null hypothesis\n\tThere ${suffStr} sufficient evidence to ${claim.equalTo ? 'reject' : 'support'} the claim.`;
    return;
}

main();