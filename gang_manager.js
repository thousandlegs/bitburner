// Big idea: use the Gang API to make sure gangs are operating effectively
//
// Expected to be run on home or some other server with plenty of RAM, as 
// part of an overall system automation process

function report(ns) {
    ns.tprint("Would report");
}


function error(ns) {
    ns.tprint("Unknown command");
}


function parseArgs(ns, args) {
    if (args[0] == "report") {

    } else {
        return error;
    }
    
}

/** @param {NS} ns **/
export async function main(ns) {
    const command = parseArgs(ns, ns.args);
    command(ns);
}
