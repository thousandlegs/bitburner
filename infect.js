import { main as map_network, netmap } from "map_network.js";
import { choose_target } from "choose_target.js";


export function runnable_threads(ns, host, script) {
    const [rtotal, rused] = ns.getServerRam(host);
    const ravail = rtotal - rused;
    const needed = ns.getScriptRam(script);
    // Note that if you're running THIS script on <host>, you will be
    // temporarily limiting yourself; but this does at least give you room
    // to rerun this script again (useful on home)
    return Math.floor(ravail / needed);
};


export async function infect_one(ns, host, target) {
    const infrastructure = ["ports.js", "autohack.js"];

    if (!target) {
        target = choose_target(ns);
    }

    const tt = runnable_threads(ns, host, "autohack.js");
    if (tt <= 0) {
        return;
    }

    ns.scriptKill("autohack.js", host);
    for (const ss of infrastructure) {
        await ns.scp(ss, "home", host);
    }

    ns.print('Running ', tt, ' threads of autohack.js on ', host, ' targeting ', target);
    ns.exec("autohack.js", host, tt, target);
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

    for (let hh of hosts) {
        await infect_one(ns, hh, "auto");
    }
}
