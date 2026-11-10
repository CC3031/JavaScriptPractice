import {tTable} from "../../../tTable.js";

let result = "";

function userInput() {
    const populationOne = {
        pHat: 12/65,
        n: 65,
    };

    const populationTwo = {
        pHat: 22/35,
        n: 35
    };

    const claim = {
        equalTo: true,      // p1 = p2
        notEqualTo: false,  // p1 != p2
        greaterThan: false, // p1 > p2
        lessThan: false     // p1 < p2
    };

    // Please enter alpha:
    const alpha = 0.05;
    
    return {populationOne, populationTwo, claim, alpha};
}

function main() {
    const {populationOne, populationTwo, claim, alpha} = userInput();
    const pBar = calcPBar(populationOne, populationTwo);

    let signToUse = claims(claim);
    alphaFunction(alpha);
    let testStat = testStatistic(populationOne, populationTwo, pBar);
    let critValues = criticalValue(alpha, signToUse);
    evaluateNull(testStat, critValues, claim);

    console.log(result);
}

function calcPBar(populationOne, populationTwo) {
    let x1 = populationOne.pHat * populationOne.n;
    let x2 = populationTwo.pHat * populationTwo.n;
    
    return ((x1 + x2) / (populationOne.n + populationTwo.n));
}

function claims(claim) {
    result += `Step 1:\n\tH0: p1 = p2\n\t`;

    switch (true) {
        case claim.equalTo || claim.notEqualTo:
            result += `H1: p1 != p2\n`;
            return "=";
        case claim.greaterThan:
            result += `H1: p1 > p2\n`;
            return ">";
        case claim.lessThan:
            result += `H1: p1 < p2\n`;
            return "<";
    }
}

function alphaFunction(alpha) {
    result += `Step 2: alpha = ${alpha}\n`;
}

function testStatistic(populationOne, populationTwo, pBar) {
    let testStat = (populationOne.pHat - populationTwo.pHat) / Math.sqrt(pBar * (1 - pBar) * (1 / populationOne.n + 1 / populationTwo.n));
    result += `Step 3: test statistic = ${testStat}\n`;

    return testStat;
}

function criticalValue(alpha, signToUse) {
    let critValues = [];
    if (signToUse == "=" || signToUse == "!=") {
        critValues.push(-1 * tTable["Large"][alpha], tTable["Large"][alpha]);
        result += `Step 4: critical values = ${critValues[0]}, ${critValues[1]}\n`;
        return critValues;

    } else if (signToUse == ">") {
        critValues.push(tTable["Large"][alpha * 2]);
    } else {
        critValues.push(-1 * tTable["Large"][alpha * 2]);
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