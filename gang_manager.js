// Big idea: use the Gang API to make sure gangs are operating effectively
//
// Expected to be run on home or some other server with plenty of RAM, as 
// part of an overall system automation process

function report_string(ns) {
    let gi = ns.gang.getGangInformation()
    if (!ns.gang.inGang()) {
        return "Not in any gang.";
    }

    let lines = [];

    
    lines.push(`In gang under ${gi.faction}`);
    lines.push(`(a ${gi.isHacking ? "hacking" : "combat"} gang with ` + 
               `${gi.power} power and ${gi.territory} territory)`);

    return lines.join('\n');

}

function report(ns) {
    ns.tprint("\n" + report_string(ns));
}


function error(ns) {
    ns.tprint("Unknown command");
}


function parseArgs(ns, args) {
    if (args[0] == "report") {
        return report;
    } else {
        return error;
    }
    
}

/** @param {NS} ns **/
export async function main(ns) {
    const command = parseArgs(ns, ns.args);
    command(ns);
}
