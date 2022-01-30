// Pull code from Github to a game instance
//
// Note: overwrites the target scripts unconditionally, so make sure
// you're either using Git exclusively or have manually captured anything
// you care about
const remote = "https://raw.githubusercontent.com/thousandlegs/bitburner/main/";
const scripts = [
    "infect.js",
    "sesame.js",
    "autohack.js",
    "map_network.js",
    "purchase-servers.js",
    "gang_manager.js",
    "bootstrap.js"
];

/** @param {NS} ns **/
export async function main(ns) {
    for (let ss of scripts) {
        await ns.wget(remote + ss, ss);
    }
}
