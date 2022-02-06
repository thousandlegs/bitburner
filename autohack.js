import { get_hack_target } from "ports.js";

function dollars(nn) {
    return "$" + nn.toExponential(2);
}


async function take_one_action(ns, target) {
    // Defines how much money a server should have before we hack it
    // In this case, it is set to 75% of the server's max money
    let moneyThresh = ns.getServerMaxMoney(target) * 0.75;

    // Defines the maximum security level the target server can
    // have. If the target's security level is higher than this,
    // we'll weaken it before doing anything else
    let securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    // Now do whatever's appropriate to this target
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

export async function autohack(ns, target) {
    let auto = (target == "auto");

    // Infinite loop that continously hacks/grows/weakens the target server
    while (true) {
        let old_target = target;
        if (auto) {
            target = get_hack_target(ns);
            if (target != old_target) {
                ns.print("Switching target to ", target);
            }
            if (!ns.hasRootAccess(target)) {
                ns.tprint("Must have root to hack ", target);
                return false;
            }        
        }
        take_one_action(ns, target);
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    // Defines the "target server", which is the server
    // that we're going to continually hack. If not specified, or
    // given as "auto", consult a well-known port for
    // the the target at every loop iteration.
    var target = ns.args[0] || "auto";
    ns.print("Target is ", target);

    await autohack(ns, target);
}
