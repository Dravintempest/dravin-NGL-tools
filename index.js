const fetch = require("node-fetch");
const figlet = require("figlet");
const gradient = require("gradient-string");
const chalk = require("chalk").default;
const readline = require("readline");

const EXIT_WORDS = ["exit", "keluar", "quit", "q"];

const sleep = (ms, variation = 0) => new Promise(resolve => {
    setTimeout(resolve, ms + (variation ? Math.floor(Math.random() * variation) : 0));
});

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(text, ans => {
        const val = ans.trim().toLowerCase();
        if (EXIT_WORDS.includes(val)) {
            console.log(chalk.red("\n[!] Keluar dari tools..."));
            rl.close();
            process.exit(0);
        }
        rl.close();
        resolve(ans);
    }));
};

const progressBar = async (text = "Menyiapkan koneksi", total = 15, delay = 150) => {
    for (let i = 0; i <= total; i++) {
        const filled = chalk.green("█".repeat(i));
        const empty = chalk.gray("░".repeat(total - i));
        process.stdout.write(`\r${chalk.yellow(`[⌛] ${text}:`)} ${filled}${empty}`);
        await sleep(delay);
    }
    process.stdout.write(chalk.green(" ✓\n"));
};

const animasiGaris = async (total = 54, delay = 50) => {
    const mid = Math.floor(total / 2);
    for (let i = 0; i <= mid; i++) {
        const kiri = chalk.green("═".repeat(i));
        const kanan = chalk.green("═".repeat(i));
        const tengah = chalk.gray(" ".repeat(total - i * 2));
        process.stdout.write(`\r${kiri}${tengah}${kanan}`);
        await sleep(delay);
    }
    process.stdout.write("\n");
};

const typeEffect = async (text, delay = 20) => {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    process.stdout.write('\n');
};

const showBanner = async () => {
    console.clear();
    const banner = figlet.textSync("DRAVIN", { font: "ANSI Shadow" });
    console.log(gradient.instagram.multiline(banner));
    await typeEffect(chalk.magenta("[⚙️] NGL Spam Tools - BY DRAVIN"));
    await animasiGaris();
    await typeEffect(chalk.green("• Jangan disalahgunakan, tanggung sendiri resikonya"));
    await typeEffect(chalk.yellow("• Ketik exit/quit/keluar/q untuk keluar"));
    await animasiGaris();
};

async function spamngl(link, pesan, jumlah) {
    if (!link.startsWith('https://ngl.link/')) throw new Error('Link NGL tidak valid!');
    if (!pesan) throw new Error('Pesan tidak boleh kosong!');
    if (isNaN(jumlah) || jumlah < 1) throw new Error('Jumlah harus angka > 0');

    const username = link.split('https://ngl.link/')[1];
    if (!username) throw new Error('Username tidak ditemukan!');

    let sukses = 0;
    await Promise.all(Array.from({ length: jumlah }).map(async (_, i) => {
        try {
            await fetch('https://ngl.link/api/submit', {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: `username=${username}&question=${encodeURIComponent(pesan)}&deviceId=1`
            });
            console.log(chalk.green(`[✓] ${i+1}/${jumlah} => Berhasil dikirim`));
            sukses++;
        } catch (err) {
            console.log(chalk.red(`[X] ${i+1}/${jumlah} => Gagal: ${err.message}`));
        }
    }));
    return { sukses, gagal: jumlah - sukses, username };
}

(async () => {
    await showBanner();
    await progressBar("Menyiapkan tools", 15, 100);

    while (true) {
        const link = await question(
            chalk.cyan('\n ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' ├──╼') + chalk.yellow('Link NGL (https://ngl.link/username)') + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯ ')
        );

        const jumlahStr = await question(
            chalk.cyan('\n ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' ├──╼') + chalk.yellow("Jumlah Spam (1-1000)") + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯ ')
        );
        const jumlah = parseInt(jumlahStr);
        if (isNaN(jumlah) || jumlah < 1 || jumlah > 1000) {
            console.log(chalk.red("\n❌ Jumlah harus 1-1000"));
            continue;
        }

        const pesan = await question(
            chalk.cyan('\n ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' ├──╼') + chalk.yellow("Pesan spam") + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯ ')
        );

        console.log(chalk.green(`\n🚀 Memulai spam ke ${link} sebanyak ${jumlah}x...\n`));

        try {
            const hasil = await spamngl(link.trim(), pesan.trim(), jumlah);
            console.log(chalk.cyan("\n📊 Ringkasan"));
            console.log(chalk.cyan(`├─ Username : ${chalk.white(hasil.username)}`));
            console.log(chalk.cyan(`├─ Total    : ${chalk.white(jumlah)}`));
            console.log(chalk.cyan(`├─ Sukses   : ${chalk.green(hasil.sukses)}`));
            console.log(chalk.cyan(`└─ Gagal    : ${chalk.red(hasil.gagal)}`));
        } catch (e) {
            console.log(chalk.red(`❌ Error: ${e.message}`));
        }

        const ulang = await question(
            chalk.cyan('\n ┌─╼') + chalk.red('[DRAVIN') + chalk.hex('#FFA500')('〄') + chalk.red('TOOLS]') + '\n' +
            chalk.cyan(' ├──╼') + chalk.magenta("🔁 Ingin spam lagi? (y/n)") + '\n' +
            chalk.cyan(' └────╼') + ' ' + chalk.red('❯') + chalk.hex('#FFA500')('❯') + chalk.blue('❯ ')
        );
        if (ulang.toLowerCase() !== "y") break;
    }

    console.log(chalk.green("\n✨ Terima kasih telah menggunakan Dravin Tools!"));
    process.exit(0);
})();
