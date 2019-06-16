export function syncSymbolName(context) {
    log("🦅 <== syncSymbolName Executed ==> 🦅 ");

    let document = require('sketch/dom').getSelectedDocument()
    var renamedInstancesCount = 0;
    let allMasterSymbols = document.getSymbols()

    allMasterSymbols.forEach(master => {
        renamedInstancesCount += syncNameWithMaster(master);
    });

    /// Callback result
    showResults(renamedInstancesCount);
}

export function syncSelectedSymbolName(context) {
    log("🦅 <== syncSelectedSymbolName Executed ==> 🦅 ");

    let document = require('sketch/dom').getSelectedDocument();
    let selectedLayers = document.selectedLayers;
    log(`Selection: ${selectedLayers}`);
    var renamedInstancesCount = 0;
    selectedLayers.forEach(layer => {
        const master = getSymbolMaster(layer);
        log(`Selection: ${master}`);
        if (master != null) {
            renamedInstancesCount += syncNameWithMaster(master);
        }
    });

    showResults(renamedInstancesCount);
}

function getSymbolMaster(layer) {
    let master = null;
    log(`getSymbolMaster layer: ${layer.type}`);
    if (layer.type == "SymbolInstance") {
        master = layer.master;
    } else if (layer.type == "SymbolMaster") {
        master = layer;
    } else {
        master = layer.getParentSymbolMaster()
        log(`getParentSymbolMaster returns: ${master}`);
    }

    return master
}

function syncNameWithMaster(master) {
    var renamedInstancesCount = 0;
    let masterName = master.name;
    // log(`Master----シンボル:${master}, Name:${master.name()}, SymbolID:${master.symbolID()}, isForeign: ${master.isForeign()}`);
    let allInstances = master.getAllInstances();
    allInstances.forEach(instance => {
        // log(`\tInstance----シンボル:${instance}, Name:${instance.name()}, SymbolID:${instance.symbolID()}`);
        if (masterName != instance.name) {
            instance.name = masterName;
            renamedInstancesCount++;
        }
    });

    return renamedInstancesCount;
}

function showResults(count) {
    var UI = require('sketch/ui')
    if (count == 0) {
        UI.message(`No symbol instance was renamed`);
    } else if (count == 1) {
        UI.message(`${count} symbol instance was renamed`);
    } else {
        UI.message(`${count} symbol instances were renamed`);
    }
}