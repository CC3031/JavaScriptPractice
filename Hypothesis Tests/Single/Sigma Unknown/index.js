import {tTable} from "../../tTable.js";

let result = "";

function userInput() {
    // Please enter the population mean:
    const data = {
        mu: 12.27, // population mean
        xBar: 11,  // sample mean
        s: 2,      // sample standard deviation
        n: 37      // sample size
    };

    // Please enter alpha:
    const alpha = 0.05;

    const claim = {
        equalTo: true,
        notEqualTo: false,
        greaterThan: false,
        lessThan: false
    };
    
    return {data, alpha, claim}
}

function main() {
    const {data, alpha, claim} = userInput();
    const signToUse = claims(data.mu, claim);
    alphaFunction(alpha);
    const testStat = testStatistic(data);
    const critValues = criticalValue(alpha, signToUse, data.n - 1);
    evaluateNull(testStat, critValues, claim);
    console.log(result);

}

function claims(mu, claim) {
    result += `Step 1:\n\tH0: mu = ${mu}\n\t`;

    switch (true) {
        case claim.equalTo || claim.notEqualTo:
            result += `H1: mu != ${mu}\n`;
            return "=";
        case claim.greaterThan:
            result += `H1: mu > ${mu}\n`;
            return ">";
        case claim.lessThan:
            result += `H1: mu < ${mu}\n`;
            return "<";
    }
}

function alphaFunction(alpha) {
    result += `Step 2: alpha = ${alpha}\n`;
}

function testStatistic(data) {
    let testStat = (data.xBar - data.mu) / (data.s / Math.sqrt(data.n))
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