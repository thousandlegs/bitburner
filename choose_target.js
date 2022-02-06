import { main as map_network, netmap } from "map_network.js";
import { sesame } from "sesame.js";
import { well_known_ports, set_port_val } from "ports.js";

export function choose_target(ns) {
    map_network(ns);
    const hacklvl = ns.getHackingLevel();

    let target;
    let target_max_money = -1;

    for (let hh of netmap) {
        ns.print("Considering ", hh, "...");
        const ss = ns.getServer(hh);
        
        // First, skip anything we can't hack
        if (!sesame(ns, ss.hostname)) {
            ns.print("...but don't have root");
            continue;
        }
        if (ss.requiredHackingSkill > hacklvl) {
            ns.print("...but we're not strong enough to hack (", hacklvl, " < ", ss.requiredHackingSkill, ")");
            continue;
        }
        // Note that the map_network function already skipped
        // darkweb, home, and our purchased servers;
        // we could use ss.purchasedByPlayer to skip
        // purchased too

        // TODO: Consider factoring in serverGrowth and minDifficulty

        // Now since we're in this for the long game, just
        // pick the server that has the maximum possible money
        // and trust that it will be our best target until
        // our hacking skill increases
        if (ss.moneyMax > target_max_money) {
            target = ss.hostname;
            target_max_money = ss.moneyMax;
            ns.print("...has best money so far (", ss.moneyMax, "); saving");
        } else {
            ns.print("...but money's not good enough (", ss.moneyMax, " < ", target_max_money, ")");
        }
    }

    return target;
}


/** @param {NS} ns **/
export async function main(ns) {
    let target = choose_target(ns);

    set_port_val(ns, well_known_ports["HACK_TARGET"], target);
    ns.tprint("Set hack target to ", target);
}