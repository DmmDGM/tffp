// Imports
import chalk from "chalk";
import nodeReadline from "node:readline";

// Creates interface
const rlInterface = nodeReadline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Initiates process
try {
	
	// Parses input
	const inputBigInt = BigInt(await question("Input: "));
	if(inputBigInt < 0) throw new SyntaxError("Cannot factorize a negative BigInt");
	const inputString = inputBigInt.toString();
	
	// Fetches timestamp
	const start = Date.now();

	// Creates caches
	const factors = new Set<string>();
	let solutions: [ bigint, bigint ][] = [ [ 0n, 0n ] ];
	let matches: [ bigint, bigint ][] = [];

	// Finds matches
	for(let digits = 0n; digits < BigInt(inputString.length); digits += 1n) {
		// Prints status
		console.log(chalk.yellow(`Finding matches at ${digits + 1n} digit(s)`));

		// Loops through all possible solutions
		for(let index = 0; index < solutions.length; index++) {
			const solution = solutions[index];
			for(let left = 0n; left < 10n; left += 1n) {
				for(let right = 0n; right < 10n; right += 1n) {
					const match: [ bigint, bigint ] = [ solution[0] + left * 10n ** digits, solution[1] + right * 10n ** digits ];
					if(factors.has(`${match[0]},${match[1]}`)) {
						continue;
					}
					const product = match[0] * match[1];
					if(product.toString().padStart(Number(digits + 1n), "0").slice(Number(-digits - 1n)) !== inputString.slice(Number(-digits - 1n))) {
						continue;
					}
					if(product > inputBigInt) {
						continue;
					}
					factors.add(`${match[0]},${match[1]}`);
					factors.add(`${match[1]},${match[0]}`);
					matches.push(match);
				}
			}
		}

		// Overwrites solutions
		solutions = matches;
		matches = [];
		factors.clear();
	}

	// Verifies solutions
	const outputs: [bigint, bigint][] = [];
	for(let index = 0; index < solutions.length; index++) {
		const solution = solutions[index];
		if(solution[0] * solution[1] === inputBigInt) {
			outputs.push(solution);
		}
	}

	// Prints time
	console.log(chalk.green(`Time processed: ${Date.now() - start}ms`));

	// Prints status
	console.log(chalk.green(`${outputs.length} match(es) passed`)); 
	for(let index = 0; index < outputs.length; index++) {
		const output = outputs[index];
		console.log(chalk.cyan(`Match: [ ${output[0]}, ${output[1]} ]`));
	}
	
	// Exits
	process.exit(0);
}
catch(error) {
	// Parses error
	if(error instanceof SyntaxError) {
		console.log(chalk.red("Error: Input must be a valid positive integer"));
	}
	else {
		console.log(error);
	}

	// Exits
	process.exit(1);
}

// Prompts user for an input
function question(query: string): Promise<string> {
	// Returns an input from the user
	return new Promise((resolve, reject) => {
		try {
			rlInterface.question(query, (answer) => {
				return resolve(answer);
			});
		}
		catch(error) {
			reject(error);
		}
	});
}