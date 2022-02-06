import { main as map_network, netmap } from "map_network.js";


// Open any ports we can on the target server
export function sesame(ns, target) {
    if (ns.hasRootAccess(target)) {
        ns.print("Already have root on ", target);
        return true;
    }

    var openers = [];

    // TODO: Turn this into an object and just iterate over it
    if (ns.fileExists("BruteSSH.exe", "home")) {
        openers.push(ns.brutessh);
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        openers.push(ns.ftpcrack);
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        openers.push(ns.relaysmtp);
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        openers.push(ns.httpworm);
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        openers.push(ns.sqlinject);
    }

    var nports = ns.getServerNumPortsRequired(target);
    if (nports > openers.length) {
        ns.print("Cannot get root on ", target, "; need ", nports, " ports but can only open ", openers.length);
        return false;
    }

    for (let oo of openers) {
        oo(target);
    }
    ns.nuke(target);

    return true;
}

/** @param {NS} ns **/
export async function main(ns) {
    let targets;
    if (ns.args.length < 1 || ns.args[0] == "all") {
        map_network(ns);
        targets = netmap;
    } else {
        targets = ns.args[0];
    }

    let num_open = 0;
    for (const tt of targets) {
        var success = sesame(ns, tt);
        if (success) {
            ++num_open;
        }
    }
    ns.tprint("Got root on ", num_open, " hosts");
}