import {tTable} from "../../tTable.js";

let result = "";

function userInput() {
    // Please enter the proportion data:
    const  proportion = {
        p: .5,       // population proportion
        pHat: .6,    // sample proportion
        n: 37        // sample size
    }

    // Please enter alpha:
    const alpha = 0.05;

    const claim = {
        equalTo: true,
        notEqualTo: false,
        greaterThan: false,
        lessThan: false
    }
    
    return {proportion, alpha, claim}
}

function main() {
    let {proportion, alpha, claim} = userInput();
    let signToUse = claims(proportion.p, claim);
    alphaFunction(alpha);
    let testStat = testStatistic(proportion);
    let critValues = criticalValue(alpha, signToUse);
    evaluateNull(testStat, critValues, claim);
    console.log(result);

}

function claims(p, claim) {
    result += `Step 1:\n\tH0: p = ${p}\n\t`;

    switch (true) {
        case claim.equalTo || claim.notEqualTo:
            result += `H1: p != ${p}\n`;
            return "=";
        case claim.greaterThan:
            result += `H1: p > ${p}\n`;
            return ">";
        case claim.lessThan:
            result += `H1: p < ${p}\n`;
            return "<";
    }
}

function alphaFunction(alpha) {
    result += `Step 2: alpha = ${alpha}\n`;
}

function testStatistic(proportion) {
    let testStat = (proportion.pHat - proportion.p) / Math.sqrt((proportion.p * (1 - proportion.p)) / proportion.n)
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