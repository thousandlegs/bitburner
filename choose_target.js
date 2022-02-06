import { main as map_network, netmap } from "map_network.js";
import { sesame } from "sesame.js";

export function choose_target(ns) {
    map_network(ns);
    const hacklvl = ns.getHackingLevel();

    let target;
    let target_max_money = -1;
    let target_hack_level = Number.MAX_VALUE;

    // TODO: Just include this in 
    for (let hh of netmap) {
        const ss = ns.getServer(hh);
         
        // First, skip anything we can't hack
        if (!sesame(ss.hostname)) {
            continue;
        }
        if (ss.requiredHackingSkill > hacklvl) {
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
        }
    }

    return target;
}


/** @param {NS} ns **/
export async function main(ns) {
    let target = choose_target(ns);

    ns.tprint("You should hack ", target);
}