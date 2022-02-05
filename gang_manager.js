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


function _set_whole_gang_activity(ns, activity) {
    let members = ns.gang.getMemberNames();

    for (let mm of members) {
        ns.gang.setMemberTask(mm, activity);
    }
    ns.tprint("All ", members.length, " gang members set to engage in ", activity);
}

function fight(ns) {
    _set_whole_gang_activity(ns, "Territory Warfare");
}


function train(ns) {
    _set_whole_gang_activity(ns, "Train Combat");
}


function traffic(ns) {
    _set_whole_gang_activity(ns, "Human Trafficking");
}


function vigilante(ns) {
    _set_whole_gang_activity(ns, "Vigilante Justice");
}


function error(ns) {
    ns.tprint("Unknown command");
}


function earn(ns) {
    // TODO: Balance money-earning activities with Vigilante Justice 
}


function respect(ns) {
    // TODO: Balance respect-garnering activities with Wanted cap
}


function somesome(ns) {
    // TODO: Something like balance training combat, hacking, charisma
    // maybe look for which ones are going slower than others?
}


function ascend(ns) {
    // TODO: Like get people growing but ascend them when 
    // the ascending is good
    // look out for respect cost but don't sweat it too much
    // Maybe look at total experience earned too? Or just decreasing
    // rate?
    // What about bonus time?

}


// TODO: get the names of functions from the functions
// themselves lol
const COMMANDS = {
    "report": report,
    "fight": fight,
    "train": train,
    "traffic": traffic,
    "vigilante": vigilante
};

function parseArgs(ns, args) {
    return COMMANDS[args[0]] || error;
}

/** @param {NS} ns **/
export async function main(ns) {
    const command = parseArgs(ns, ns.args);
    command(ns);
}
