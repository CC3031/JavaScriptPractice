import {tTable} from "../../../tTable.js";

let result = "";

function userInput() {
    let populationOne = {
        xBar: 12.27,
        s: 2.5,
        n: 27
    };

    let populationTwo = {
        xBar: 15,
        s: 2.7,
        n: 35
    };

    let claim = {
        equalTo: true, // mu1 = mu2
        notEqualTo: false, // mu1 != mu2
        greaterThan: false, // mu1 > mu2
        lessThan: false // mu1 < mu2
    };

    // Please enter alpha:
    let alpha = 0.05;
    
    return {populationOne, populationTwo, claim, alpha};
}

function main() {
    let {populationOne, populationTwo, claim, alpha} = userInput();

    let signToUse = claims(claim);
    alphaFunction(alpha);
    let testStat = testStatistic(populationOne, populationTwo);
    
    let degreesOfFreedom = 0;
    if (populationOne.n > populationTwo.n) {
        degreesOfFreedom = populationTwo.n - 1;
    } else {
        degreesOfFreedom = populationOne.n - 1;
    }
    let critValues = criticalValue(alpha, signToUse, degreesOfFreedom);

    evaluateNull(testStat, critValues, claim);
    
    console.log(result);

}

function claims(claim) {
    result += `Step 1:\n\tH0: mu1 = mu2\n\t`;

    switch (true) {
        case claim.equalTo || claim.notEqualTo:
            result += `H1: mu1 != mu2\n`;
            return "=";
        case claim.greaterThan:
            result += `H1: mu1 > mu2\n`;
            return ">";
        case claim.lessThan:
            result += `H1: mu1 < mu2\n`;
            return "<";
    }
}

function alphaFunction(alpha) {
    result += `Step 2: alpha = ${alpha}\n`;
}

function testStatistic(populationOne, populationTwo) {
    let testStat = (populationOne.xBar - populationTwo.xBar) / Math.sqrt((populationOne.s**2 / populationOne.n) + (populationTwo.s**2 / populationTwo.n));
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