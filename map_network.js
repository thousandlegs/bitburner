export var netmap = [];

/** @param {NS} ns **/
export async function main(ns, verbose) {

    if (ns.args[0] == "--verbose") {
        verbose = true;
    }
    // So we can also invoke verbosity programmatically
    var SAY = ns.print;
    if (verbose) {
        SAY = ns.tprint;
    }

    // Find all reachable hosts, storing in object netmap
    var exclude = ["home", "darkweb"];
    exclude = exclude.concat(ns.getPurchasedServers());
    SAY("Excluding ", exclude.length, " hosts");
    SAY(exclude);


    var want = function (h) {
        if (exclude.includes(h)) {
            return false;
        }
        if (netmap.includes(h)) {
            return false;
        }
        return true;
    };


    var map_from = function (host) {
        SAY("Looking for new hosts starting at ", host);
        var neighbors = ns.scan(host);
        var new_neighbors = neighbors.filter(want);
        if (new_neighbors.length == 0) {
            SAY("...nothing new seen from ", host, " (out of ", neighbors.length, " checked)");
            return;
        }

        SAY("...found ", new_neighbors.length, " new hosts out of ", neighbors.length);
        SAY("   ", new_neighbors);

        netmap = netmap.concat(new_neighbors);
        SAY(netmap.length, " hosts found so far");
        new_neighbors.forEach(map_from);
    };


    var arr2str = function (a, prefix) {
        var s = '';
        if (!prefix) {
            prefix = '';
        }

        for (var e of a) {
            s += prefix + e + '\n';
        }
        return s;
    }

    map_from("home");

    netmap.sort();
    SAY('Found ', netmap.length, ' hosts');
    SAY('\n', arr2str(netmap, "  "));
}
