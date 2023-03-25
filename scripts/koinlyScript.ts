let transactions: any = []

const getCostBase = (row: Element) => {
    const COST_BASIS_KEY = "cost basis";

    return Array.from(row.getElementsByTagName("span"))
        .filter(s => s.textContent && s.textContent.includes(COST_BASIS_KEY) && s.children.length === 0)
        .map(s => s.textContent && Number(s.textContent.split(/\s|&nbsp;/g)[1]))[0]
}

const getFiatValue = (row: Element) => {
    const FIAT_VALUE_KEY = "≈ BGN";

    return Array.from(row.getElementsByTagName("span"))
        .filter(s => s.textContent && s.textContent.includes(FIAT_VALUE_KEY) && s.children.length === 0)
        .map(s => s.textContent && Number(s.textContent.split(/\s|&nbsp;/g)[2]))[0]
}

const getPnl = (row: Element) => {
    const PROFIT_KEY = "profit";
    const LOSS_KEY = "loss";

    return Array.from(row.getElementsByTagName("b"))
        .filter(s => s.textContent && s.textContent.includes(PROFIT_KEY) && s.children.length === 0)
        .map(s => s.textContent && Number(s.textContent.split(/\s|&nbsp;/g)[1]))[0]
        ??
        Array.from(row.getElementsByTagName("b"))
            .filter(s => s.textContent && s.textContent.includes(LOSS_KEY) && s.children.length === 0)
            .map(s => s.textContent && Number("-".concat(s.textContent.split(/\s|&nbsp;/g)[1])))[0]
}

const downloadObjectAsJson = (exportObj, exportName) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

const addDataFromPage = () => {
    Array.from(document.getElementsByClassName("well pointer row px-0 px-xl-2")).forEach(row => {
        const costBase = getCostBase(row)
        const fiatValue = getFiatValue(row)
        const pnl = getPnl(row)

        if (costBase && fiatValue && pnl) {
            transactions.push({
                costBase: costBase,
                fiatValue: fiatValue,
                pnl: pnl
            })
        }
    })
}

const goToNextPage = () => {
    Array.from(Array.from(document.getElementsByClassName("pagination"))[0].getElementsByTagName("a")).filter(a => a.textContent && a.textContent === "›" && a.children.length === 0)[0].click()
}

const harvestPage = () => {
    addDataFromPage()
    goToNextPage()
}

const exportTransactionsToJSON = () => {
    downloadObjectAsJson(transactions, "kTransactions")
}
