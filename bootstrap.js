// Pull code from Github to a game instance
//
// Note: overwrites the target scripts unconditionally, so make sure
// you're either using Git exclusively or have manually captured anything
// you care about
const remote = "https://raw.githubusercontent.com/thousandlegs/bitburner/main/";
const BOOTSTRAP = "bootstrap.js";
const scripts = [
    "infect.js",
    "sesame.js",
    "autohack.js",
    "map_network.js",
    "purchase-servers.js",
    "gang_manager.js",
    BOOTSTRAP
];


async function _get(ns, fname) {
    await ns.wget(remote + fname, fname);
}

async function update(ns) {
    for (let ss of scripts) {
        await _get(ns, ss);
    }
}

async function bootstrap(ns) {
    ns.tprint("Updating bootstrap itself");
    await _get(ns, BOOTSTRAP);
    ns.tprint("Updating all scripts");

    ns.exec(BOOTSTRAP, "home");
}

/** @param {NS} ns **/
export async function main(ns) {
    if (ns.args[0] == "bootstrap") {
        await bootstrap(ns);
    } else {
        await update(ns);
    }
}
