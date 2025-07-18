import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import config from "../src/config/config.js";
import {
  createErrorMessage,
  createInfoBox,
  createSpinner,
  colors,
  icons,
} from "../src/utils/terminal.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables
if (!config.validate()) {
  console.error(createErrorMessage("Configuration validation failed"));
  console.error(
    createInfoBox(
      "Check your .env file",
      ["Please ensure all required variables are set."],
      { borderColor: "red" },
    ),
  );
  process.exit(1);
}

// Function to update help command choices after deployment
async function updateHelpCommandChoices() {
  try {
    console.log(
      `${icons.info} ${colors.cyan("Updating help command choices...")}`,
    );

    // Load all commands to create choices
    const commands = [];
    const commandsPath = path.join(__dirname, "../src/commands");
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const commandFiles = fs
        .readdirSync(folderPath)
        .filter(file => file.endsWith(".js"));

      for (const file of commandFiles) {
        try {
          const filePath = path.join(folderPath, file);
          const command = (await import(filePath)).default;

          if (
            command &&
            command.data &&
            command.data.name &&
            command.data.name !== "help"
          ) {
            commands.push(command);
          }
        } catch (error) {
          console.warn(
            colors.warning(`⚠️  Skipping command ${file}: ${error.message}`),
          );
        }
      }
    }

    // Generate choices
    const choices = commands
      .filter(cmd => cmd.data.description)
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
      .map(cmd => {
        const commandName = cmd.data.name;
        const displayName = commandName
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return {
          name: displayName,
          value: commandName,
        };
      });

    console.log(
      colors.success(`✅ Generated ${choices.length} help command choices`),
    );

    // Update the help command file
    const helpCommandPath = path.join(
      __dirname,
      "../src/commands/general/help.js",
    );
    let helpContent = fs.readFileSync(helpCommandPath, "utf8");

    // Find and replace the choices in the help command
    const choicesRegex = /\.addChoices\([\s\S]*?\)/;
    const newChoices = `.addChoices(\n${choices
      .map(
        choice => `      { name: "${choice.name}", value: "${choice.value}" }`,
      )
      .join(",\n")}\n    )`;

    if (choicesRegex.test(helpContent)) {
      helpContent = helpContent.replace(choicesRegex, newChoices);
      fs.writeFileSync(helpCommandPath, helpContent, "utf8");
      console.log(
        colors.success(
          `✅ Updated help command with ${choices.length} dynamic choices`,
        ),
      );
    } else {
      console.log(
        colors.warning(`⚠️  Could not find choices section in help command`),
      );
    }
  } catch (error) {
    console.error(
      createErrorMessage(
        `Failed to update help command choices: ${error.message}`,
      ),
    );
  }
}

// Command collection with validation
async function collectCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, "../src/commands");
  console.log(colors.info(`Looking for commands in: ${commandsPath}`));

  if (!fs.existsSync(commandsPath)) {
    console.error(createErrorMessage("Commands directory not found"));
    return commands;
  }

  const commandFolders = fs.readdirSync(commandsPath);
  let totalCommands = 0;

  console.log(
    `${icons.folder || "📁"} ${colors.cyan(`Found ${commandFolders.length} category(ies).`)}`,
  );

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);

    if (!fs.statSync(folderPath).isDirectory()) {
      console.warn(colors.warning(`   ⚠️  Skipping non-directory: ${folder}`));
      continue;
    }

    const commandFiles = fs
      .readdirSync(folderPath)
      .filter(file => file.endsWith(".js"));

    console.log(
      `${icons.folder || "📂"} ${colors.cyan(`${commandFiles.length} command(s) in category: ${folder}`)}`,
    );

    for (const file of commandFiles) {
      try {
        const filePath = path.join(folderPath, file);
        const command =
          (await import(filePath)).default || (await import(filePath));

        if (!command.data) {
          console.warn(
            colors.warning(`      ⚠️  Command ${file} missing 'data' property`),
          );
          continue;
        }

        if (!command.execute) {
          console.warn(
            colors.warning(
              `      ⚠️  Command ${file} missing 'execute' property`,
            ),
          );
          continue;
        }

        // Validate command structure
        if (!command.data.name) {
          console.warn(
            colors.warning(`      ⚠️  Command ${file} missing name`),
          );
          continue;
        }

        if (!command.data.description) {
          console.warn(
            colors.warning(
              `      ⚠️  Command ${command.data.name} missing description`,
            ),
          );
          continue;
        }

        commands.push(command.data.toJSON());
        console.log(
          colors.success(`      ✅ Collected command: ${command.data.name}`),
        );
        totalCommands++;
      } catch (error) {
        console.error(
          createErrorMessage(
            `      ❌ Failed to load command ${file}: ${error.message}`,
          ),
        );
      }
    }
  }

  console.log(colors.magenta(`📊 Total commands collected: ${totalCommands}`));
  return commands;
}

// Deployment function
async function deployCommands() {
  try {
    console.log(
      `${icons.rocket} ${colors.green("Starting command deployment...")}`,
    );

    // Collect all commands
    const commands = await collectCommands();
    console.log(
      colors.green(`📊 Total commands collected: ${commands.length}`),
    );

    // Initialize REST client
    const rest = new REST({ version: "10" }).setToken(config.discord.token);

    // Determine deployment type
    const isGlobal = process.argv.includes("--global");
    const deploymentType = isGlobal ? "Global" : "Guild";
    console.log(
      `${icons.info} Deployment Type: ${colors.cyan(deploymentType)}`,
    );
    if (isGlobal) {
      console.log(`${icons.server} Global`);
    } else {
      console.log(`${icons.server} Guild: ${config.discord.guildId}`);
    }

    // Remove all commands first
    const spinner = createSpinner("Removing existing commands...");
    spinner.start();
    if (isGlobal) {
      await rest.put(Routes.applicationCommands(config.discord.clientId), {
        body: [],
      });
    } else {
      await rest.put(
        Routes.applicationGuildCommands(
          config.discord.clientId,
          config.discord.guildId,
        ),
        { body: [] },
      );
    }
    spinner.succeed(colors.success("Existing commands removed"));

    // Deploy new commands
    const deploySpinner = createSpinner("Deploying new commands...");
    deploySpinner.start();
    if (isGlobal) {
      await rest.put(Routes.applicationCommands(config.discord.clientId), {
        body: commands,
      });
    } else {
      await rest.put(
        Routes.applicationGuildCommands(
          config.discord.clientId,
          config.discord.guildId,
        ),
        {
          body: commands,
        },
      );
    }
    deploySpinner.succeed(
      colors.success("Command deployment completed successfully!"),
    );
    console.log(
      createInfoBox(
        "Deployment Summary",
        [
          `${icons.success} Deployed ${commands.length} command(s)`,
          `${icons.info} Deployment Type: ${deploymentType}`,
          isGlobal
            ? `${icons.server} Global`
            : `${icons.server} Guild: ${config.discord.guildId}`,
          `${icons.time} ${new Date().toLocaleString()}`,
        ],
        { borderColor: "green" },
      ),
    );

    commands.forEach((command, index) => {
      console.log(
        colors.success(
          `   ${index + 1}. /${command.name} - ${command.description}`,
        ),
      );
    });

    console.log(
      colors.info("🕒 Note: Global commands may take up to 1 hour to appear."),
    );
    console.log(colors.info("   Guild commands appear immediately.\n"));

    // Update help command choices after successful deployment
    await updateHelpCommandChoices();
  } catch (error) {
    console.error(
      createErrorMessage(`Command deployment failed: ${error.message}`),
    );
    console.error(
      createInfoBox(
        "Troubleshooting",
        [
          "Verify your bot token is correct",
          'Ensure the bot has the "applications.commands" scope',
          "Check that CLIENT_ID matches your application",
          "For guild deployment, verify GUILD_ID is correct",
        ],
        { borderColor: "red" },
      ),
    );
    process.exit(1);
  }
}

// Error handling
process.on("unhandledRejection", error => {
  console.error(
    createErrorMessage(`Unhandled promise rejection: ${error.message}`),
  );
  process.exit(1);
});

process.on("uncaughtException", error => {
  console.error(createErrorMessage(`Uncaught exception: ${error.message}`));
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log(colors.warning("\n🛑 Deployment interrupted"));
  process.exit(0);
});

// Start deployment
await deployCommands();
