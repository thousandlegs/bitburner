import {runnable_threads} from "infect.js";

// TODO: Gradually scale up servers by starting small, then replacing with the 
// next largest size we can afford.

/** @param {NS} ns **/
export async function main(ns) {
    // How much RAM each purchased server will have. In this case, it'll
    // be 8GB.
    const ram_gb = ns.args[0] || 16;

    // TODO: Also let this script participate in the 
    // port instruction dance
    let target = "joesguns";
    const script = "autohack.ns";

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers

    // Sadly, a do...while doesn't work if we init 
    // nservers to 0 because then we try to get the
    // max ram for a server that doesn't exist yet
    let nservers = ns.getPurchasedServers().length;
 
    while (nservers < ns.getPurchasedServerLimit()) {
        let available_money = ns.getServerMoneyAvailable("home");
        let needed_money = ns.getPurchasedServerCost(ram_gb);
        // Check if we have enough money to purchase a server
        if (available_money > needed_money) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking script onto the newly-purchased server
            //  3. Run our hacking script on the newly-purchased server with 3 threads
            //  4. Increment our iterator to indicate that we've bought a new server
            var hostname = ns.purchaseServer("pserv-" + nservers, ram_gb);
            ns.print("Purchased server ", hostname);
            let nthreads = runnable_threads(ns, hostname, script);
            await ns.scp(script, "home", hostname);
            ns.exec(script, hostname, nthreads, target);
        } else {
            // Let the money accumulate
            ns.print("Waiting for enough money to buy a server (need ", needed_money, ", have ", Math.round(available_money), ")");
            await ns.sleep(10000);
        }
        nservers = ns.getPurchasedServers().length;
    }

    ns.print("Max number of servers purchased");
}
