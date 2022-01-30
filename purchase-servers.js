import {infect_one} from "infect.js";

// TODO: Gradually scale up servers by starting small, then replacing with the 
// next largest size we can afford.

/** @param {NS} ns **/
export async function main(ns) {
    // How much RAM each purchased server will have in GB
    const ram_gb = ns.args[0] || 16;

    // TODO: Also let this script participate in the 
    // port instruction dance

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    //
    // TODO: See if we can automatically scale up our servers over time
    // as we get more money; remember to start at 4GB or whatever your
    // current "base" script requires. Use deleteServer, getPurchasedServers,
    // and getServerRam
    const needed_money = ns.getPurchasedServerCost(ram_gb);

    // Sadly, a do...while doesn't work if we init 
    // nservers to 0 because then we try to get the
    // max ram for a server that doesn't exist yet
    let nservers = ns.getPurchasedServers().length;

    while (nservers < ns.getPurchasedServerLimit()) {
        let available_money = ns.getServerMoneyAvailable("home");

        if (available_money > needed_money) {
            // TODO: Use sprintf or whatever to get 2-digit server IDs
            var hostname = ns.purchaseServer("pserv-" + nservers, ram_gb);
            ns.print("Purchased server ", hostname);

            // TODO: Use exec() to get the cost of this script down
            infect_one(ns, hostname);
        } else {
            // Let the money accumulate
            ns.print("Waiting for enough money to buy a server (need ", needed_money, ", have ", Math.round(available_money), ")");
            await ns.sleep(10000);
        }
        nservers = ns.getPurchasedServers().length;
    }

    ns.print("Max number of servers purchased");
}
