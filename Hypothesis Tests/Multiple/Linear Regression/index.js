import {pearsonRTable} from "./pearsonRTable.js";

let result = "";

function input() {
    const data = {
        rows: {
            x: [28,26,25.5,28,27,23.5,23.5,32,25.5,24.5],           // change this
            y: [73,68,66,65,74,71,62,78,66,65]                      // and this
        },
        sums: {}
    };
    data.n = data.rows.x.length;
    data.sums.x = data.rows.x.reduce((total, num) => total + num, 0);
    data.sums.x2 = data.rows.x.reduce((total, num) => total + num ** 2, 0);
    data.sums.y = data.rows.y.reduce((total, num) => total + num, 0);
    data.sums.y2 = data.rows.y.reduce((total, num) => total + num ** 2, 0)
    data.sums.xy = data.rows.x.reduce((total, num, i) => total + num * data.rows.y[i], 0);

    // Please enter alpha too:
    const alpha = 0.1;
    
    return {data, alpha}
}

function main() {
    const {data, alpha} = input();
    claims();
    alphaFunction(alpha);
    const statistics = testStatistic(data);
    const critValues = criticalValue(data.n - 2, alpha);
    const rejNull = evaluateNull(statistics.r, critValues);
    determiningAppropStat(data, statistics, rejNull);

    console.log(result);
}

function claims() {
    result += `Step 1:\n\tH0: rho = 0\n\t`;
    result += `H1: != 0\n`;
}

function alphaFunction(alpha) {
    result += `Step 2: alpha = ${alpha}\n`;
}

function testStatistic(data) {
    const statistics = {};
    statistics.a = (data.n * data.sums.xy - data.sums.x * data.sums.y) / (data.n * data.sums.x2 - (data.sums.x)**2);
    statistics.b = (data.sums.y / data.n) - statistics.a * (data.sums.x / data.n);
    statistics.r = (data.n * data.sums.xy - data.sums.x * data.sums.y) / Math.sqrt((data.n * data.sums.x2 - (data.sums.x)**2) * (data.n * data.sums.y2 - (data.sums.y)**2));
    statistics.r2 = statistics.r**2;

    result += `Step 3: test statistic = ${statistics.r}\n`;
    return statistics;
}

function criticalValue(df, alpha) {
    let critValues = [];
    critValues.push(-1 * pearsonRTable[df][alpha]);
    critValues.push(pearsonRTable[df][alpha]);
    result += `Step 4: critical values = ${critValues[0]}, +${critValues[1]}\n`;
    return critValues;
}

function evaluateNull(r, critValues) {
    // reject the null if the test statistic is outside of the critical values
    const rejectNull = critValues[0] > r || r > critValues[1];
    const suffStr = rejectNull ? 'is' : 'is not';
    const rejectStr = rejectNull ? 'Reject' : 'Failed to reject';

    result += `Step 5: ${rejectStr} null hypothesis\n\tThere ${suffStr} sufficient evidence to support the claim.`;
    return rejectNull;
}

function determiningAppropStat(data, statistics, rejNull) {
    result += `\n\nRegression Equation:\n\tyHat = ${Math.round(statistics.a * 1000) / 1000}x + ${Math.round(statistics.b * 1000) / 1000}`;
    result += `\nMean:\n\tyBar = ${data.sums.y / data.n}`;
    result += `\n\nIt would be most appropriate to use the ${rejNull ? 'regression equation' : 'mean'}.`;
}

main();