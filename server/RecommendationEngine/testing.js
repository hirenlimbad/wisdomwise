function mergeAndSortInteractions(oldInteractions, latestInteractions, decayFactor) {
    let interactionMap = new Map();

    // Process old interactions, apply decay factor, and store them in the map
    for (let [tag, count] of oldInteractions) {
        interactionMap.set(tag, { count: count * decayFactor, recent: false });
    }

    // Update the map with the latest interactions
    for (let [tag, count] of latestInteractions) {
        if (interactionMap.has(tag)) {
            interactionMap.get(tag).count += count;
            interactionMap.get(tag).recent = true;
        } else {
            interactionMap.set(tag, { count: count, recent: true });
        }
    }

    // Convert the map to an array and sort it
    let mergedInteractions = Array.from(interactionMap.entries())
        .map(([tag, info]) => [tag, info.count, info.recent])
        .sort((a, b) => {
            // Sort by recent status first, then by count
            if (a[2] === b[2]) {
                return b[1] - a[1]; // Sort by count if both are recent or both are old
            }
            return b[2] - a[2]; // Sort by recent status
        })
        .map(([tag, count]) => [tag, count]); // Remove the 'recent' property from the final output

    return mergedInteractions;
}

// Example usage:
let oldInteractions = [['art', 4], ['truth', 3], ['love', 2]];
let latestInteractions = [['kill', 2], ['truth', 1]];
let latestInteractions2 = [['suiside', 3]];
let decayFactor = 0.6; // Adjust the decay factor as needed

let mergedInteractions = mergeAndSortInteractions(oldInteractions, latestInteractions, decayFactor);
let mergedInteractions2 = mergeAndSortInteractions(mergedInteractions, latestInteractions2, decayFactor)
console.log(mergedInteractions2);
