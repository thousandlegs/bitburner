// Open any ports we can on the target server
function sesame(ns, target) {
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
    if (ns.args.length < 1) {
        ns.tprint("Usage: sesame HOST");
        exit(1);
    }


    var target = ns.args[0];

    var success = sesame(ns, target);
    if (success) {
        ns.tprint("Success");
    } else {
        ns.tprint("Failed to get root on ", target);
    }
}

export { sesame };
