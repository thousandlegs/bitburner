import { sesame } from "sesame.js";
import { main as map_network, netmap } from "map_network.js";


export function runnable_threads(ns, host, script) {
    const ram = ns.getServerMaxRam(host);
    const needed = ns.getScriptRam(script);
    return Math.floor(ram / needed);
};


async function infect_one(ns, host, script, target) {
    const hopen = sesame(ns, host);
    if (!hopen) {
        return;
    }

    const reqlvl = ns.getServerRequiredHackingLevel(target);
    const mylvl = ns.getHackingLevel();
    if (mylvl < reqlvl) {
        ns.print("Not strong enough to hack ", target, " need ", reqlvl, " have ", mylvl);
    }

    const tt = runnable_threads(ns, host, script);
    if (tt <= 0) {
        return;
    }

    ns.scriptKill(script, host);
    await ns.scp(script, "home", host);

    ns.print('Running ', tt, ' threads of ', script, ' on ', host, ' targeting ', target);
    ns.exec(script, host, tt, target);
};


function _remove(v, a) {
    let vindex = a.indexOf(v);
    if (vindex < 0) {
        return false;
    } else {
        a.splice(vindex, 1);
        return true;
    }
}

function parseHostArgs(ns, args) {
    let spec = args.slice();
    let hosts = [];

    let want_purchased = false;
    let want_reachable = false;

    if (spec.length == 0) {
        spec = ["all"];
    }

    if (_remove("all", spec)) {
        want_purchased = true;
        want_reachable = true;
    }
    if (_remove("purchased", spec)) {
        want_purchased = true;
    }
    if (_remove("reachable", spec)) {
        want_reachable = true;
    }

    hosts = hosts.concat(spec);
    if (want_reachable) {
        map_network(ns);
        hosts = hosts.concat(netmap);
    }
    if (want_purchased) {
        hosts = hosts.concat(ns.getPurchasedServers());
    }

    return hosts;
}

/** @param {NS} ns **/
export async function main(ns) {
    let hosts = parseHostArgs(ns, ns.args);

    ns.print("Will infect ", hosts);
    const script = "autohack.js";
    const target = "joesguns"; // 10
    // const target = "catalyst"; // 450
    // const target = "rho-construction"; // 500
    // const target = "lexo-corp"; // 678
    // const target = "defcomm"; // 1023
    // const target = "megacorp"; // 1105

    for (let hh of hosts) {
        await infect_one(ns, hh, script, target);
    }
}