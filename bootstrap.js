// Pull code from Bitbucket to a game instance
//
// Note: overwrites the target scripts unconditionally, so make sure
// you're either using Git exclusively or have manually captured anything
// you care about
const remote = "https://raw.githubusercontent.com/thousandlegs/bitburner/main/";
const scripts = [
    "infect.js",
];

/** @param {NS} ns **/
export async function main(ns) {
    for (let ss of scripts) {
        await ns.wget(remote + ss, ss);
    }
}
