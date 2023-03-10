import simpleGit, { ResetMode } from "simple-git";
import { promises as fs } from "fs";

const generateFauxRepoActivity = async (
  branch = "master",
  filePath = "faux-activity.txt"
) => {
  console.log("Creating faux repo activity using git");
  const git = simpleGit();
  const config = await git.listConfig();
  if (!config.all["user.name"] || !config.all["user.email"]) {
    console.log("Configuring git user");
    git
      .addConfig("user.name", "GitHub Robot 🤖")
      .addConfig(
        "user.email",
        "41898282+github-actions[bot]@users.noreply.github.com"
      );
  }
  console.log("Checking out branch", branch);
  await git.checkout(branch);
  console.log("Creating file", filePath);
  await fs.appendFile(filePath, new Date().toISOString());
  console.log("Committing and pushing file", filePath);
  await git
    .add(filePath)
    .commit("Creating some repo activity 🏃‍")
    .push("origin", branch);
  console.log("Hard resetting to HEAD~1 and force pushing");
  await git
    .reset(ResetMode.HARD, ["HEAD~1"])
    .push("origin", branch, ["--force"]);
  console.log("Changes pushed to branch", branch);
};
