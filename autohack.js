function dollars(nn) {
    return "$" + nn.toExponential(2);
}

export async function autohack(ns, target) {
    // Defines how much money a server should have before we hack it
    // In this case, it is set to 75% of the server's max money
    let moneyThresh = ns.getServerMaxMoney(target) * 0.75;

    // Defines the maximum security level the target server can
    // have. If the target's security level is higher than this,
    // we'll weaken it before doing anything else
    let securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    // sesame(ns, target);

    // Infinite loop that continously hacks/grows/weakens the target server
    while (true) {
        let cursec = ns.getServerSecurityLevel(target);
        let curmon = ns.getServerMoneyAvailable(target);
        ns.print("Security: cur=", cursec, " want <=", securityThresh);
        ns.print("Money: available=", dollars(curmon), " want >=", dollars(moneyThresh));
        if (cursec > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            await ns.weaken(target);
        } else if (curmon < moneyThresh) {
            // If the server's money is less than our threshold, grow it
            await ns.grow(target);
        } else {
            // Otherwise, hack it
            await ns.hack(target);
        }
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    // Defines the "target server", which is the server
    // that we're going to hack. If not specified, hack
    // the hosting server (useless on purchased servers
    // and home)

    // TODO: Read from a well-known port; also keep checking that port for change in target
    var target = ns.args[0] || ns.getHostname();
    ns.print("Target is ", target);

    if (!ns.hasRootAccess(target)) {
        ns.tprint("Must have root to autohack ", target);
        return false;
    }

    await autohack(ns, target);
}
